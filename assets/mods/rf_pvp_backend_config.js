// RF PVP / RF Ranking Monitor connection settings
// 本檔案只放在本機 assets/mods/TOOLS/，不要提交到公開 repository。
(function configureRfBackend() {
  "use strict";

  // 已沿用你舊檔案中的 Worker 網址；請只替換下方兩組密鑰。
  const PVP_WORKER_ORIGIN = "https://rf-pvp-analyzer-api.chengyen1209.workers.dev";
  const PVP_WRITE_SECRET = "reallegend1209";

  const RANKING_WORKER_ORIGIN = "https://rf-ranking-monitor-api.chengyen1209.workers.dev";
  const RANKING_WRITE_SECRET = "reallegend0";

  const pvpEndpoint = `${PVP_WORKER_ORIGIN.replace(/\/$/, "")}/api/pvp/capture`;
  const rankingEndpoint = `${RANKING_WORKER_ORIGIN.replace(/\/$/, "")}/api/rankings/capture`;
  const pvpKey = PVP_WRITE_SECRET === "PASTE_NEW_PVP_WRITE_SECRET_HERE" ? "" : PVP_WRITE_SECRET;
  const rankingSecret = RANKING_WRITE_SECRET === "PASTE_NEW_RANKING_WRITE_SECRET_HERE" ? "" : RANKING_WRITE_SECRET;

  window.STARTUP_BRIDGE_CONFIG = Object.freeze({
    endpoint: pvpEndpoint,
    apiKey: pvpKey,
    rankingEndpoint,
    rankingSecret,
  });

  // 守衛初始化時會呼叫這個函式取得設定（只會被呼叫一次，呼叫後自動清除）
  window.__RF_PVP_CONSUME_BACKEND_CONFIG__ = function() {
    return {
      endpoint: pvpEndpoint,
      writeSecret: pvpKey,
      rankingEndpoint,
      rankingSecret,
    };
  };

  // 目前守衛使用的相容欄位。
  window.RF_PVP_BACKEND_ENDPOINT = pvpEndpoint;
  window.RF_PVP_WRITE_SECRET = pvpKey;
  window.RF_RANKING_ENDPOINT = rankingEndpoint;
  window.RF_RANKING_WRITE_SECRET = rankingSecret;

  console.log(
    `[RF backend config] PVP=${pvpEndpoint}; ranking=${rankingEndpoint}; ` +
    `pvpKey=${pvpKey ? "configured" : "not configured"}; ` +
    `rankingSecret=${rankingSecret ? "configured" : "not configured"}`,
  );
})();
