// rf_mod_loader_nopanel.js
// 無介面版 mod loader：只載入已啟用的 JS/CSS，不在遊戲畫面建立管理面板。

(function () {
    "use strict";

    console.log("[LOADER] 無介面小工具載入器啟動");

    // id：工具識別名稱，也用作 localStorage 設定鍵。
    // src：JS 檔案路徑；沒有 JS 時填 null。
    // css：CSS 檔案路徑；沒有 CSS 時填 null。
    // enabled：沒有 localStorage 設定時使用的預設值。
    const TOOLS = [
        { id: "據點顯示優化",        src: "./mods/custom_attackmap.js",      css: "./mods/custom_attackmap.css", enabled: true },
        { id: "圖資缺漏檢查",        src: "./mods/uw_hook.js",                 css: null,                           enabled: false },
        { id: "顯示角色最高等級",    src: "./mods/show_level_cap.js",          css: null,                           enabled: true },
        { id: "角色戰力個別顯示",    src: "./mods/restore_power_display.js",   css: null,                           enabled: true },
        { id: "排名戰顯示對手名稱",  src: "./mods/pvp_opponent_persist.js",    css: null,                           enabled: true },
        { id: "夏夏の小工具",        src: "./mods/rf_mod.js",                  css: "./mods/rf_mod.css",            enabled: true },
        { id: "夏夏の音量調整工具",  src: "./mods/rf_audio_panel.js",          css: null,                           enabled: false },
        { id: "登入介面帳號管理",    src: "./mods/rf_account_manager.js",      css: null,                           enabled: true }
    ];

    const STORAGE_KEY = "uw_loader_config";

    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const config = raw ? JSON.parse(raw) : {};
            return config && typeof config === "object" ? config : {};
        } catch (error) {
            console.warn("[LOADER] 設定讀取失敗，改用預設值", error);
            return {};
        }
    }

    function isEnabled(tool, config) {
        return Object.prototype.hasOwnProperty.call(config, tool.id)
            ? config[tool.id] === true
            : tool.enabled === true;
    }

    function injectScript(tool) {
        const script = document.createElement("script");
        script.src = tool.src;
        script.defer = true;
        script.dataset.uwTool = tool.id;
        script.onerror = function () {
            console.warn("[LOADER] 載入失敗：" + tool.id + "（" + tool.src + "）");
        };
        document.head.appendChild(script);
        console.log("[LOADER] 載入 JS：" + tool.id);
    }

    function injectStyle(tool) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = tool.css;
        link.dataset.uwTool = tool.id;
        link.onerror = function () {
            console.warn("[LOADER] 載入失敗：" + tool.id + "（" + tool.css + "）");
        };
        document.head.appendChild(link);
        console.log("[LOADER] 載入 CSS：" + tool.id);
    }

    const config = loadConfig();

    TOOLS.forEach(function (tool) {
        if (!isEnabled(tool, config)) return;
        if (tool.css) injectStyle(tool);
        if (tool.src) injectScript(tool);
    });
})();
