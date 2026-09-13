// loader.js - 統一管理所有小工具的載入
// index.html 只需要掛這一支，其他工具都寫在下面的 CORE / TOOLS 清單裡集中管理
console.log("[LOADER] 小工具載入器啟動");

(function(){
    // ---- 路徑基準 ----
    // 動態插入的 <script src="./xxx.js"> 是相對於「文件」(index.html) 解析的，
    // 不是相對於 loader.js 自己。所有工具都跟 loader.js 放在同一個資料夾，
    // 所以這裡取 loader.js 自身的所在目錄當基準，下面的清單就能一直維持 "./xxx.js"。
    // 好處是整個 mod/ 資料夾可以整包搬到別的位置，只要改 index.html 那一行路徑就好。
    const BASE = (function(){
        const self = document.currentScript;   // 必須在同步執行期間讀取
        return self && self.src ? new URL(".", self.src).href : "./";
    })();
    // 主程式排在所有工具後面，確保音訊/WebSocket 攔截先安裝。
    const MAIN = document.currentScript && document.currentScript.dataset.main;

    function resolve(path){
        try {
            return new URL(path, BASE).href;
        } catch (e) {
            return path;
        }
    }

    // ---- 浮動視窗總開關 ----
    // false = 不顯示任何浮動視窗（小工具管理器、音量控制、獎勵追蹤、側錄面板全部不建立）。
    // 工具本身照常運作，只是沒有 UI —— 音量設定、獎勵標示、等級上限這些功能都不受影響。
    //
    // 注意：關掉之後畫面上就沒有「[小工具管理器]」可以勾選工具了。
    // 要臨時打開不必改這裡，在瀏覽器 Console 執行：
    //     UWPanel.setVisible(true)     再重新整理頁面
    //     UWPanel.setVisible(null)     清掉臨時設定，回到這裡的預設值
    // 這個臨時設定存在 localStorage 的 uw_panels_visible。
    const SHOW_PANELS = false;

    // 提供給 uw_panel.js 讀取（它由下面的 CORE 注入，會在本檔跑完之後才執行）
    window.UW_SHOW_PANELS = SHOW_PANELS;

    // ---- 共用基礎模組：一律載入，不可在面板關閉 ----
    // 其他工具會依賴這些（UWPanel 外殼、RFStore 遊戲資料），關掉會連帶壞掉
    const CORE = [
        { id: "uw_panel", src: "./uw_panel.js", css: "./uw_panel.css" },
        { id: "rf_store", src: "./rf_store.js", css: null },
        // uw_sched：共用 DOM 變動排程器。所有工具改成向它登記，全站只留一個 MutationObserver。
        // 必須排在 TOOLS 前面（靠 s.async = false 保證執行順序）。
        { id: "uw_sched", src: "./uw_sched.js", css: null }
    ];

    // ---- 在這裡集中管理所有小工具 ----
    // id: 顯示用名稱
    // src: JS 檔案路徑（沒有的話留 null）
    // css: CSS 檔案路徑（沒有的話留 null）
    // enabled: 預設要不要載入（之後也可以在畫面上的管理面板即時開關，存在 localStorage）
    const TOOLS = [
        // fix_aria_hidden：原本寫死在 index.html 裡的內嵌腳本，2026-08-19 外移到這裡。
        // 它負責消除 antd 彈窗關閉後的 aria-hidden 焦點警告，建議保持開啟；
        // 關掉只會讓那些 console 警告回來，不影響遊戲功能，但排查效能時可以關。
        { id: "fix_aria_hidden",        src: "./fix_aria_hidden.js",        css: null,                           enabled: true  },
        { id: "custom_attackmap",       src: "./custom_attackmap.js",       css: "./custom_attackmap.css",       enabled: true  },
        // uw_hook 是診斷工具（側錄 WebSocket 大封包），平時不需要開著：
        // 它的 listener 掛在每一個入站封包上，而且會把封包留在記憶體裡。2026-08-18 起預設關閉，
        // 要用的時候再從這個面板打開即可。
        { id: "uw_hook",                src: "./uw_hook.js",                css: null,                           enabled: false },
        { id: "show_level_cap",         src: "./show_level_cap.js",         css: null,                           enabled: true  },
        { id: "restore_power_display",  src: "./restore_power_display.js",  css: null,                           enabled: true  },
        { id: "pvp_opponent_persist",   src: "./pvp_opponent_persist.js",   css: null,                           enabled: false  },
        { id: "city_reward_tracker",    src: "./city_reward_tracker.js",    css: "./city_reward_tracker.css",    enabled: false  },
        { id: "rf_audio_panel",         src: "./rf_audio_panel.js",         css: null,                           enabled: false  },
        { id: "rf_mod",                 src: "./rf_mod.js",                 css: "./rf_mod.css",                 enabled: false }, // 目前沒用處，預設關閉
        // 2026-08-19：帳號面板的樣式從 rf_mod.css 抽成自己的 rf_account_manager.css。
        // 原本掛在 rf_mod 底下，但 rf_mod 預設關閉、CSS 就不會被注入，
        // 導致這支雖然預設開啟卻是無樣式狀態。
        { id: "rf_account_manager",     src: "./rf_account_manager.js",     css: "./rf_account_manager.css",     enabled: true  }
    ];

    const STORAGE_KEY = "uw_loader_config";

    function loadConfig(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveConfig(cfg){
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch (e) {
            console.warn("[LOADER] 設定儲存失敗", e);
        }
    }

    function isEnabled(tool, cfg){
        // localStorage 裡有記錄就用記錄的值，沒有就用 TOOLS 清單裡的預設值
        return Object.prototype.hasOwnProperty.call(cfg, tool.id) ? cfg[tool.id] : tool.enabled;
    }

    function injectScript(tool){
        const s = document.createElement("script");
        s.src = resolve(tool.src);
        // 動態建立的 script 預設是 async，defer 對它無效；
        // 要讓它們照插入順序執行必須明確設 async = false，
        // 否則 uw_panel / rf_store 這些共用模組不保證會先跑完。
        s.async = false;
        s.dataset.uwTool = tool.id;
        s.onerror = function(){
            console.warn("[LOADER] 載入失敗：" + tool.id + "（" + tool.src + "）找不到檔案或路徑錯誤");
        };
        document.head.appendChild(s);
        console.log("[LOADER] 載入 JS：" + tool.id);
    }

    function injectStyle(tool){
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = resolve(tool.css);
        l.dataset.uwTool = tool.id;
        l.onerror = function(){
            console.warn("[LOADER] 載入失敗：" + tool.id + "（" + tool.css + "）找不到檔案或路徑錯誤");
        };
        document.head.appendChild(l);
        console.log("[LOADER] 載入 CSS：" + tool.id);
    }

    function inject(tool){
        if (tool.css) injectStyle(tool); // CSS 先載入，避免無樣式畫面閃一下(FOUC)
        if (tool.src) injectScript(tool);
    }

    function loadEnabledTools(){
        const cfg = loadConfig();
        CORE.forEach(inject);            // 共用模組先掛，async=false 保證先執行
        TOOLS.forEach(tool => {
            if (!isEnabled(tool, cfg)) return;
            inject(tool);
        });
    }

    // ---- 畫面上的管理面板：開關每支工具（改動後需要重新整理頁面才會生效）----
    function buildPanel(){
        if (!window.UWPanel) {
            console.warn("[LOADER] 找不到 UWPanel，管理面板略過");
            return;
        }

        const panel = window.UWPanel.create({
            id: "uw_loader",
            title: "[小工具管理器]",
            tabTitle: "小工具",
            side: "left",
            width: "220px",
            hint: "改動後重新整理頁面才會生效"
        });
        if (!panel) return;

        const cfg = loadConfig();

        CORE.forEach(tool => {
            const row = document.createElement("div");
            row.className = "uw-panel-row";
            const box = document.createElement("input");
            box.type = "checkbox";
            box.checked = true;
            box.disabled = true;
            box.title = "共用基礎模組，無法關閉";
            const name = document.createElement("span");
            name.textContent = tool.id + " ";
            const badge = document.createElement("small");
            badge.style.opacity = ".5";
            badge.textContent = "[core]";
            name.appendChild(badge);
            row.append(box, name);
            panel.body.appendChild(row);
        });

        TOOLS.forEach(tool => {
            const row = document.createElement("label");
            row.className = "uw-panel-row";
            const box = document.createElement("input");
            box.type = "checkbox";
            box.checked = isEnabled(tool, cfg);
            box.dataset.id = tool.id;
            const name = document.createElement("span");
            name.textContent = tool.id + " ";
            if (tool.css) {
                const badge = document.createElement("small");
                badge.style.opacity = ".5";
                badge.textContent = "[css]";
                name.appendChild(badge);
            }
            row.append(box, name);
            panel.body.appendChild(row);
        });

        panel.body.addEventListener("change", function(e){
            if (!e.target.matches("input[type=checkbox]")) return;
            const id = e.target.dataset.id;
            if (!id) return;
            const newCfg = loadConfig();
            newCfg[id] = e.target.checked;
            saveConfig(newCfg);
        });
    }

    function whenPanelReady(fn){
        if (window.UWPanel) { fn(); return; }
        document.addEventListener("uw-panel-ready", fn, { once: true });
    }

    function start(){
        whenPanelReady(buildPanel);
    }

    loadEnabledTools();
    if (MAIN) injectScript({ id: "game", src: MAIN });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
