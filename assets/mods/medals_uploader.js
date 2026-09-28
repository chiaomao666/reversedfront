// medals_uploader.js - 主動對遊戲已加入的 player:<id> 頻道送出 "medals" 請求，把積分推送到 Worker
// 在 rf_mod_loader.js 的 TOOLS 清單裡加入這支腳本即可（必須在遊戲建立 WebSocket 之前載入）
console.log("[MEDALS] 啟動外部副程式：積分上傳器已載入");

(function () {
    if (window.__rfMedalsInstalled) return;
    window.__rfMedalsInstalled = true;

    // ========== 設定區 ==========
    const WORKER_URL   = "https://rf-ranking-monitor-api.chengyen1209.workers.dev";
    const WRITE_SECRET = "填入新密鑰"; // 跟 Worker 的 RANKING_WRITE_SECRET 一樣
    // ============================

    // ---- 節流設定（主動請求一定要克制，避免看起來像機器人）----
    const TOPIC_COOLDOWN_MS   = 10 * 60 * 1000; // 同一個玩家頻道 10 分鐘內最多主動查一次
    const MIN_GAP_MS          = 3000;           // 兩次主動請求之間至少間隔 3 秒
    const MAX_REQUESTS_PER_HR = 30;             // 每小時主動請求上限
    const FIRST_DELAY_RANGE   = [1500, 4000];   // 看到頻道後，隨機等 1.5~4 秒再送
    const REPLY_TIMEOUT_MS    = 15000;
    const UPLOAD_MIN_GAP_MS   = 30 * 1000;      // 同一個玩家 30 秒內不重複上傳

    const MODES = ["1v1", "3v3"];
    const PLAYER_TOPIC = /^player:(\d+)$/i;

    if (WORKER_URL.includes("填入") || WRITE_SECRET.includes("填入")) {
        console.warn("[MEDALS] 尚未設定 Worker 連線資訊，請填入 WORKER_URL 和 WRITE_SECRET");
        return;
    }

    // ---------- 上傳 ----------
    const lastUpload = new Map(); // playerId -> timestamp

    // 回應格式：{ "1v1": {collected, medal_id, rank, score}, "3v3": {...}, Union: null, medals: [...], ... }
    function medalsFrom(response) {
        if (!response || typeof response !== "object") return null;
        const scores = {};
        for (const mode of MODES) {
            const e = response[mode];
            if (!e || typeof e !== "object") continue;
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

    // ---------- 主動請求（全域計數）----------
    let refCounter = 0;
    const sentTimes = [];
    function underHourlyCap() {
        const cutoff = Date.now() - 3600 * 1000;
        while (sentTimes.length && sentTimes[0] < cutoff) sentTimes.shift();
        return sentTimes.length < MAX_REQUESTS_PER_HR;
    }

    // 每條 WebSocket 各自一份狀態
    function attach(ws) {
        const session = {
            joinRefs: new Map(),   // topic -> 遊戲自己加入頻道時用的 joinRef
            lastQuery: new Map(),  // topic -> 上次主動查詢時間
            pending: new Map(),    // 我們送出的 ref -> topic
            queue: [],
            busy: false
        };
        ws.__rfMedalsSession = session;

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
            const ref = "rfm-" + (++refCounter);         // 用非數字前綴，避免跟遊戲自己的 ref 撞號
            session.pending.set(ref, topic);
            setTimeout(() => session.pending.delete(ref), REPLY_TIMEOUT_MS);
            sentTimes.push(Date.now());
            ws.send(JSON.stringify([joinRef, ref, topic, "medals", {}]));
        }

        function scheduleQuery(topic) {
            const now = Date.now();
            if (now - (session.lastQuery.get(topic) || 0) < TOPIC_COOLDOWN_MS) return;
            session.lastQuery.set(topic, now); // 先標記，避免同一批訊息重複排程
            const [lo, hi] = FIRST_DELAY_RANGE;
            setTimeout(() => { session.queue.push(topic); pump(); }, lo + Math.random() * (hi - lo));
        }

        // 手動重新查詢：在 console 輸入 rfMedalsRefresh()
        window.rfMedalsRefresh = function () {
            session.lastQuery.clear();
            for (const topic of session.joinRefs.keys()) scheduleQuery(topic);
        };

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
            if (evt !== "phx_reply") return;

            // 1) 我們自己送的請求的回覆
            const mine = ref != null ? String(ref) : "";
            if (session.pending.has(mine)) {
                session.pending.delete(mine);
                if (payload && payload.status === "ok") {
                    const scores = medalsFrom(payload.response);
                    if (scores) uploadMedals(playerId, scores);
                    else console.warn("[MEDALS] 回覆沒有 1v1/3v3 積分：", topic);
                } else {
                    console.warn("[MEDALS] 主動請求被拒絕：", topic, payload && payload.status);
                }
                return;
            }

            // 2) 遊戲自己的回覆：順便記下 joinRef；若剛好是 medals 回覆就直接上傳，並視同已查詢
            if (joinRef != null) session.joinRefs.set(topic, String(joinRef));
            const scores = medalsFrom(payload && payload.response);
            if (scores) {
                session.lastQuery.set(topic, Date.now());
                uploadMedals(playerId, scores);
            } else if (joinRef != null) {
                scheduleQuery(topic);
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

    console.log("[MEDALS] 已啟動：遊戲加入 player 頻道後，會自動送出 medals 請求並上傳積分");
})();
