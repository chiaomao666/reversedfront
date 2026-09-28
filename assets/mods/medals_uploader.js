// medals_uploader.js - 攔截排名戰 medals 封包，把自己的積分推送到 Worker
// 在 rf_mod_loader.js 的 TOOLS 清單裡加入這支腳本即可
console.log("[MEDALS] 啟動外部副程式：積分上傳器已載入");

(function(){
    // ========== 設定區 ==========
    const WORKER_URL   = "https://rf-ranking-monitor-api.chengyen1209.workers.dev";   // 例如 https://rf-ranking-monitor-api.chengyen1209.workers.dev
    const WRITE_SECRET = "reallegend0"; // 跟 rf_pvp_backend_config.js 裡的 rankingSecret 一樣
    // ============================

    if (WORKER_URL.includes("填入") || WRITE_SECRET.includes("填入")) {
        console.warn("[MEDALS] 尚未設定 Worker 連線資訊，請填入 WORKER_URL 和 WRITE_SECRET");
        return;
    }

    let lastUpload = 0;
    const MIN_INTERVAL_MS = 30 * 1000; // 同一份資料 30 秒內不重複上傳

    async function uploadMedals(playerId, data) {
        const now = Date.now();
        if (now - lastUpload < MIN_INTERVAL_MS) return;
        lastUpload = now;

        const modes = ["1v1", "3v3"];
        const payload = { playerId: String(playerId), scores: {} };

        for (const mode of modes) {
            const entry = data[mode];
            if (!entry || typeof entry !== "object") continue;
            const rank  = Number(entry.rank);
            const score = Number(entry.score);
            if (!Number.isFinite(rank)) continue;
            payload.scores[mode] = {
                rank:     rank,
                score:    Number.isFinite(score) ? score : 0,
                medalId:  Number(entry.medal_id) || null
            };
        }

        if (!Object.keys(payload.scores).length) return;

        try {
            const resp = await fetch(`${WORKER_URL}/api/medals/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RF-Ranking-Secret": WRITE_SECRET
                },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                const result = await resp.json();
                console.log("[MEDALS] 積分上傳成功：", payload.scores, result);
            } else {
                const err = await resp.text();
                console.warn("[MEDALS] 積分上傳失敗：", resp.status, err);
            }
        } catch (e) {
            console.warn("[MEDALS] 網路錯誤：", e.message);
        }
    }

    // 攔截 WebSocket 訊息，找 medals 的 phx_reply
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        ws.addEventListener("message", function(event) {
            if (typeof event.data !== "string") return;
            try {
                const msg = JSON.parse(event.data);
                // Phoenix 格式：[joinRef, ref, topic, event, payload]
                if (!Array.isArray(msg) || msg.length < 5) return;
                const topic = String(msg[2] || "");
                const event_ = String(msg[3] || "");
                const payload = msg[4];

                // 找 player:<id> 的 phx_reply，且 response 含有 1v1 積分
                if (/^player:\d+$/i.test(topic) && event_ === "phx_reply") {
                    const response = payload?.response;
                    if (response && typeof response === "object" &&
                        (response["1v1"] || response["3v3"]) &&
                        response["1v1"]?.score !== undefined) {
                        const playerIdMatch = topic.match(/^player:(\d+)$/);
                        const playerId = playerIdMatch ? playerIdMatch[1] : null;
                        if (playerId) {
                            console.log("[MEDALS] 攔截到積分資料，player:", playerId);
                            uploadMedals(playerId, response);
                        }
                    }
                }
            } catch (e) {
                // 解析失敗，不是 JSON，跳過
            }
        });
        return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;

    console.log("[MEDALS] 監聽已啟動，進入排名戰結果畫面時將自動上傳積分");
})();
