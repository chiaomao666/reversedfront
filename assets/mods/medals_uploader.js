// medals_uploader.js
//   1) 對遊戲已加入的 player:<id> 頻道主動送 "medals" 請求 → 上傳積分
//   2) 每小時對自己的 player:<id> 頻道送一次 "rankings" 請求 → 上傳完整排行榜快照
// 在 rf_mod_loader.js 的 TOOLS 清單裡加入這支腳本即可（必須在遊戲建立 WebSocket 之前載入）
console.log("[MEDALS] 啟動外部副程式：積分／排行榜上傳器已載入");

(function () {
    if (window.__rfMedalsInstalled) return;
    window.__rfMedalsInstalled = true;

    // ========== 設定區 ==========
    const WORKER_URL   = "https://rf-ranking-monitor-api.chengyen1209.workers.dev";
    const WRITE_SECRET = "填入新密鑰"; // 跟 Worker 的 RANKING_WRITE_SECRET 一樣
    // ============================

    // ---- 積分（medals）節流 ----
    const TOPIC_COOLDOWN_MS   = 10 * 60 * 1000; // 同一個玩家頻道 10 分鐘內最多主動查一次
    const MIN_GAP_MS          = 3000;           // 兩次主動 medals 請求之間至少間隔 3 秒
    const MAX_REQUESTS_PER_HR = 30;             // 每小時主動 medals 請求上限
    const FIRST_DELAY_RANGE   = [1500, 4000];   // 看到頻道後，隨機等 1.5~4 秒再送
    const REPLY_TIMEOUT_MS    = 15000;
    const UPLOAD_MIN_GAP_MS   = 30 * 1000;      // 同一個玩家 30 秒內不重複上傳積分

    // ---- 排行榜快照（rankings）排程 ----
    const RANKINGS_INTERVAL_MS   = 60 * 60 * 1000;   // 每小時一次
    const RANKINGS_JITTER_MS     = 3 * 60 * 1000;    // 每次再隨機多等 0~3 分鐘，避免整點準時送出
    const RANKINGS_START_DELAY   = [30000, 90000];   // 遊戲剛連上、需要補抓時，等 30~90 秒
    const RANKINGS_RETRY_MS      = 5 * 60 * 1000;    // 失敗後 5 分鐘重試
    const RANKINGS_MAX_RETRIES   = 3;                // 連續失敗 3 次就放棄這一輪，等下個週期
    const RANKINGS_REPLY_TIMEOUT = 30000;
    const RANKINGS_UPLOAD_MIN_GAP_MS = 60 * 1000;    // Worker 本來就限制同模式 60 秒一份
    const TICK_MS                = 60 * 1000;        // 每分鐘檢查一次是否該送
    const LAST_KEY               = "rf_rankings_last_capture";

    const MODES = ["1v1", "3v3"];
    const PLAYER_TOPIC = /^player:(\d+)$/i;

    if (WORKER_URL.includes("填入") || WRITE_SECRET.includes("填入")) {
        console.warn("[MEDALS] 尚未設定 Worker 連線資訊，請填入 WORKER_URL 和 WRITE_SECRET");
        return;
    }

    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    let refCounter = 0;

    // =====================================================
    //  積分（medals）
    // =====================================================
    const lastUpload = new Map(); // playerId -> timestamp

    // 回應格式：{ "1v1": {collected, medal_id, rank, score}, "3v3": {...}, Union: null, medals: [...], ... }
    function medalsFrom(response) {
        if (!response || typeof response !== "object") return null;
        const scores = {};
        for (const mode of MODES) {
            const e = response[mode];
            if (!e || typeof e !== "object" || Array.isArray(e)) continue;
            const rank = Number(e.rank);
            if (!Number.isFinite(rank)) continue;
            const score = Number(e.score);
            const medalId = e.medal_id != null && Number.isFinite(Number(e.medal_id)) ? Number(e.medal_id) : null;
            scores[mode] = { rank, score: Number.isFinite(score) ? score : 0, medalId };
        }
        return Object.keys(scores).length ? scores : null;
    }

    async function uploadMedals(playerId, scores) {
        const now = Date.now();
        const prev = lastUpload.get(playerId) || 0;
        if (now - prev < UPLOAD_MIN_GAP_MS) return;
        lastUpload.set(playerId, now);
        try {
            const resp = await fetch(`${WORKER_URL}/api/medals/capture`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-RF-Ranking-Secret": WRITE_SECRET },
                body: JSON.stringify({ playerId: String(playerId), scores })
            });
            if (resp.ok) {
                console.log("[MEDALS] 積分上傳成功：", playerId, scores);
            } else {
                lastUpload.set(playerId, prev); // 失敗就不要鎖住下一次
                console.warn("[MEDALS] 積分上傳失敗：", resp.status, await resp.text());
            }
        } catch (e) {
            lastUpload.set(playerId, prev);
            console.warn("[MEDALS] 網路錯誤：", e.message);
        }
    }

    const sentTimes = [];
    function underHourlyCap() {
        const cutoff = Date.now() - 3600 * 1000;
        while (sentTimes.length && sentTimes[0] < cutoff) sentTimes.shift();
        return sentTimes.length < MAX_REQUESTS_PER_HR;
    }

    // =====================================================
    //  排行榜快照（rankings）
    // =====================================================
    // 回應格式：{ "1v1": [{id, image, name, nation_id, organization, ...} x900], "3v3": [...],
    //             player_rank: {"1v1": {all, nation}, "3v3": {...}}, player: {...} }
    function orgName(o) {
        if (o && typeof o === "object") return String(o.name ?? o.title ?? "");
        return String(o ?? "");
    }

    function rowsFrom(list) {
        if (!Array.isArray(list)) return [];
        const rows = [];
        list.forEach((p, i) => {
            if (!p || typeof p !== "object") return;
            const id = String(p.id ?? p.playerId ?? "");
            if (!id && !p.name) return;
            const row = {
                id,
                name: String(p.name ?? ""),
                organization: orgName(p.organization),
                // 陣列順序就是名次（player_rank 會在下面做抽樣驗證）
                rank: Number(p.rank) > 0 ? Number(p.rank) : i + 1
            };
            if (p.nation_id != null && Number.isFinite(Number(p.nation_id))) row.nationId = Number(p.nation_id);
            rows.push(row);
        });
        return rows;
    }

    function rankingsFrom(response, ownId) {
        if (!response || typeof response !== "object") return null;
        const modes = {};
        for (const mode of MODES) {
            const rows = rowsFrom(response[mode]);
            if (!rows.length) continue;
            modes[mode] = rows;
            // 驗證：自己的名次位置上的 ID 應該就是自己（名次落在 900 名之外就略過）
            const pr = response.player_rank && response.player_rank[mode];
            const at = pr && Number(pr.all);
            if (ownId && Number.isFinite(at) && at >= 1 && at <= rows.length && rows[at - 1].id !== String(ownId)) {
                console.warn(`[RANK] ${mode} 名次驗證失敗：第 ${at} 名的 ID 是 ${rows[at - 1].id}，不是 ${ownId}，陣列順序可能不等於名次`);
            }
        }
        return Object.keys(modes).length ? modes : null;
    }

    let lastCapture = 0;
    try { lastCapture = Number(localStorage.getItem(LAST_KEY)) || 0; } catch (e) { /* 沒有 localStorage 就只在記憶體內計時 */ }
    let nextDue = 0;
    let failCount = 0;

    function scheduleNormal() {
        nextDue = lastCapture + RANKINGS_INTERVAL_MS + rand(0, RANKINGS_JITTER_MS);
    }
    function scheduleStart() {
        // 距離上次成功不到一小時就照原本週期；否則（或從沒抓過）稍等一下就抓
        const normal = lastCapture + RANKINGS_INTERVAL_MS + rand(0, RANKINGS_JITTER_MS);
        const soon = Date.now() + rand(RANKINGS_START_DELAY[0], RANKINGS_START_DELAY[1]);
        nextDue = lastCapture && normal > soon ? normal : soon;
    }
    function markCaptured() {
        lastCapture = Date.now();
        failCount = 0;
        try { localStorage.setItem(LAST_KEY, String(lastCapture)); } catch (e) { /* ignore */ }
        scheduleNormal();
    }
    function scheduleRetry() {
        failCount++;
        if (failCount >= RANKINGS_MAX_RETRIES) {
            console.warn("[RANK] 連續失敗，這一輪先放棄，下個週期再試");
            failCount = 0;
            nextDue = Date.now() + RANKINGS_INTERVAL_MS;
        } else {
            nextDue = Date.now() + RANKINGS_RETRY_MS;
        }
    }
    scheduleStart();

    let lastRankingsUpload = 0;
    async function uploadRankings(modes) {
        const now = Date.now();
        if (now - lastRankingsUpload < RANKINGS_UPLOAD_MIN_GAP_MS) return true; // 剛傳過，視為已完成
        lastRankingsUpload = now;
        try {
            const resp = await fetch(`${WORKER_URL}/api/rankings/capture`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-RF-Ranking-Secret": WRITE_SECRET },
                body: JSON.stringify({ capturedAt: now, modes })
            });
            if (resp.ok) {
                const result = await resp.json().catch(() => ({}));
                console.log("[RANK] 排行榜快照上傳完成：",
                    Object.fromEntries(Object.entries(modes).map(([k, v]) => [k, v.length])), result);
                return true;
            }
            lastRankingsUpload = 0;
            console.warn("[RANK] 排行榜上傳失敗：", resp.status, await resp.text());
            return false;
        } catch (e) {
            lastRankingsUpload = 0;
            console.warn("[RANK] 網路錯誤：", e.message);
            return false;
        }
    }

    // =====================================================
    //  掛到每條 WebSocket 上
    // =====================================================
    function attach(ws) {
        const session = {
            joinRefs: new Map(),   // topic -> 遊戲自己加入頻道時用的 joinRef
            lastQuery: new Map(),  // topic -> 上次主動查 medals 的時間
            pending: new Map(),    // 我們送出的 ref -> { kind, topic }
            queue: [],
            busy: false,
            ownTopic: null         // 自己的 player:<id> 頻道
        };

        // ---------- medals ----------
        function pump() {
            if (session.busy) return;
            const topic = session.queue.shift();
            if (!topic) return;
            session.busy = true;
            sendMedals(topic);
            setTimeout(() => { session.busy = false; pump(); }, MIN_GAP_MS);
        }

        function sendMedals(topic) {
            const joinRef = session.joinRefs.get(topic);
            if (joinRef == null) return;                 // 遊戲沒加入這個頻道就不送
            if (ws.readyState !== 1) return;             // 連線不是 OPEN
            if (!underHourlyCap()) {
                console.warn("[MEDALS] 已達每小時主動請求上限，略過");
                return;
            }
            const ref = "rfm-" + (++refCounter);         // 非數字前綴，避免跟遊戲自己的 ref 撞號
            session.pending.set(ref, { kind: "medals", topic });
            setTimeout(() => session.pending.delete(ref), REPLY_TIMEOUT_MS);
            sentTimes.push(Date.now());
            ws.send(JSON.stringify([joinRef, ref, topic, "medals", {}]));
        }

        function scheduleMedals(topic) {
            const now = Date.now();
            if (now - (session.lastQuery.get(topic) || 0) < TOPIC_COOLDOWN_MS) return;
            session.lastQuery.set(topic, now); // 先標記，避免同一批訊息重複排程
            setTimeout(() => { session.queue.push(topic); pump(); }, rand(FIRST_DELAY_RANGE[0], FIRST_DELAY_RANGE[1]));
        }

        // ---------- rankings ----------
        function sendRankings(topic) {
            const joinRef = session.joinRefs.get(topic);
            if (joinRef == null || ws.readyState !== 1) return;
            const ref = "rfr-" + (++refCounter);
            session.pending.set(ref, { kind: "rankings", topic });
            setTimeout(() => {
                if (session.pending.has(ref)) {          // 逾時沒回覆
                    session.pending.delete(ref);
                    console.warn("[RANK] 排行榜請求逾時");
                    scheduleRetry();
                }
            }, RANKINGS_REPLY_TIMEOUT);
            console.log("[RANK] 定時送出排行榜請求：", topic);
            ws.send(JSON.stringify([joinRef, ref, topic, "rankings", {}]));
        }

        function hasPendingRankings() {
            for (const v of session.pending.values()) if (v.kind === "rankings") return true;
            return false;
        }

        const timer = setInterval(function tick() {
            if (ws.readyState === 2 || ws.readyState === 3) { clearInterval(timer); return; }
            if (ws.readyState !== 1) return;
            const topic = session.ownTopic;
            if (!topic || session.joinRefs.get(topic) == null) return;
            if (hasPendingRankings()) return;
            if (Date.now() < nextDue) return;
            sendRankings(topic);
        }, TICK_MS);

        // 測試用：在 console 輸入 rfRankingsNow() 立刻抓一次；rfMedalsRefresh() 重新查積分
        window.rfRankingsNow = function () { nextDue = 0; };
        window.rfMedalsRefresh = function () {
            session.lastQuery.clear();
            for (const topic of session.joinRefs.keys()) scheduleMedals(topic);
        };

        async function handleRankingsResponse(topic, response, fromGame) {
            const m = topic.match(PLAYER_TOPIC);
            const modes = rankingsFrom(response, m && m[1]);
            if (!modes) {
                console.warn("[RANK] 回覆裡沒有 1v1/3v3 排行榜資料");
                if (!fromGame) scheduleRetry();
                return;
            }
            const ok = await uploadRankings(modes);
            if (ok) markCaptured();
            else if (!fromGame) scheduleRetry();
        }

        ws.addEventListener("message", function (event) {
            if (typeof event.data !== "string") return;
            let msg;
            try { msg = JSON.parse(event.data); } catch (e) { return; }
            // Phoenix V2：[joinRef, ref, topic, event, payload]
            if (!Array.isArray(msg) || msg.length < 5) return;
            const [joinRef, ref, topic, evt, payload] = msg;
            const m = typeof topic === "string" ? topic.match(PLAYER_TOPIC) : null;
            if (!m) return;
            const playerId = m[1];

            if (evt === "phx_close" || evt === "phx_error") {
                session.joinRefs.delete(topic);
                return;
            }
            // update_data 帶有 profile（體力、未讀電報）→ 這是自己的頻道
            if (evt === "update_data") {
                if (payload && payload.profile) session.ownTopic = topic;
                return;
            }
            if (evt !== "phx_reply") return;

            // 1) 我們自己送的請求的回覆
            const mine = ref != null ? session.pending.get(String(ref)) : null;
            if (mine) {
                session.pending.delete(String(ref));
                if (!payload || payload.status !== "ok") {
                    console.warn(`[${mine.kind === "rankings" ? "RANK" : "MEDALS"}] 主動請求被拒絕：`, topic, payload && payload.status);
                    if (mine.kind === "rankings") scheduleRetry();
                    return;
                }
                if (mine.kind === "rankings") {
                    handleRankingsResponse(topic, payload.response, false);
                } else {
                    const scores = medalsFrom(payload.response);
                    if (scores) uploadMedals(playerId, scores);
                    else console.warn("[MEDALS] 回覆沒有 1v1/3v3 積分：", topic);
                }
                return;
            }

            // 2) 遊戲自己的回覆
            if (joinRef != null) session.joinRefs.set(topic, String(joinRef));
            const response = payload && payload.response;

            // 2a) 遊戲自己的排行榜回覆（你打開排行榜時）→ 直接上傳，並視同這一輪已完成
            if (response && response.player_rank && (Array.isArray(response["1v1"]) || Array.isArray(response["3v3"]))) {
                session.ownTopic = topic;
                handleRankingsResponse(topic, response, true);
                return;
            }

            // 2b) 遊戲自己的 medals 回覆 → 直接上傳，視同已查詢；否則排程主動查
            const scores = medalsFrom(response);
            if (scores) {
                session.lastQuery.set(topic, Date.now());
                uploadMedals(playerId, scores);
            } else if (joinRef != null) {
                scheduleMedals(topic);
            }
        });
    }

    // ---------- 包裝 WebSocket ----------
    const NativeWS = window.WebSocket;
    function PatchedWebSocket(url, protocols) {
        const ws = protocols === undefined ? new NativeWS(url) : new NativeWS(url, protocols);
        try { attach(ws); } catch (e) { console.warn("[MEDALS] 掛載失敗：", e.message); }
        return ws;
    }
    PatchedWebSocket.prototype = NativeWS.prototype;
    Object.setPrototypeOf(PatchedWebSocket, NativeWS);
    ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach((k) => { PatchedWebSocket[k] = NativeWS[k]; });
    window.WebSocket = PatchedWebSocket;

    console.log("[MEDALS] 已啟動：積分主動查詢 + 每小時排行榜快照");
})();
