// RF PVP Analyzer - Cloudflare Worker connection settings
// 請只修改下方 RF_PVP_WRITE_SECRET；不要把寫入密鑰分享到聊天或提交到公開 repository。
(function configureRfPvpBackend() {
  "use strict";

  const WORKER_ORIGIN = "https://rf-pvp-analyzer-api.chengyen1209.workers.dev";
  const WRITE_SECRET = "reallegend1209"; // <-- 請在此輸入你的寫入密鑰，若不需要寫入功能可留空

  window.RF_PVP_BACKEND_ENDPOINT = `${WORKER_ORIGIN}/api/pvp/capture`;
  window.RF_PVP_WRITE_SECRET = WRITE_SECRET === "1" ? "" : WRITE_SECRET;

  console.log(
    `[RF PVP config] Worker endpoint ready: ${window.RF_PVP_BACKEND_ENDPOINT}; ` +
    `writeSecret=${window.RF_PVP_WRITE_SECRET ? "configured" : "not configured"}`,
  );
})();
