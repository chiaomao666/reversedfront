// loader.js - 統一管理所有小工具的載入
// assets/index.html 只需要掛這一支；所有 mod 檔案固定放在 assets/mods/。
console.log("[LOADER] 小工具載入器啟動");

(function(){
    // 共用核心：所有工具共用面板、React store 存取與 DOM 變動排程器。
    // 保持既有小工具清單與 localStorage 開關；核心一律先載入。
    const SHOW_PANELS = true;
    window.UW_SHOW_PANELS = SHOW_PANELS;

    const CORE = [
        { id: "uw_panel", src: "./mods/uw_panel.js", css: "./mods/uw_panel.css" },
        { id: "rf_store", src: "./mods/rf_store.js", css: null },
        { id: "uw_sched", src: "./mods/uw_sched.js", css: null }
    ];

    // ---- 在這裡集中管理所有小工具 ----
    const TOOLS = [
        // 固定位置：assets/mods/rf_pvp_backend_config.js；必須最先載入，讓守衛初始化前取得 Worker 設定。
        { id: "RF PVP Worker 連線設定",
            src: "./mods/rf_pvp_backend_config.js",
            css: null,
            enabled: true
        },
        { id: "PVP Socket 被動觀察器",
            src: "./mods/rf_pvp_socket_tap.js",
            css: null,
            enabled: true
        },
        { id: "排名戰戰績被動監控",
            src: "./mods/pvp_double_match_guard.js",
            css: null,
            enabled: true
        },
        { id: "排名戰積分上傳器",
            src: "./mods/medals_uploader.js",
            css: null,
            enabled: true
        },
        { id: "QM 驗證繞過",
            src: "./mods/qm_bypass.js",
            css: null,
            enabled: true
        },
        { id: "地圖資源快取",
            src: "./mods/rf_map_cache.js",
            css: null,
            enabled: true
        },
        { id: "mapviewer",
            src: "./MapViewer.js",
            css: "./MapViewer.css",
            enabled: true
        },
        { id: "據點顯示優化",
            src: "./mods/custom_attackmap.js",
            css: "./mods/custom_attackmap.css", 
            enabled: true
        },
        { id: "戰鬥硬體加速",
            src: null,
            css: "./mods/battle_css_accel.css",
            enabled: false
        },
        { id: "戰鬥等待加速",
            src: "./mods/battle_wait_speed.js",
            css: null,
            enabled: false
        },
        { id: "戰鬥動畫跳過",
            src: "./mods/battle_skip_anim.js",
            css: null,
            enabled: false
        },
        { id: "顯示角色最高等級",
            src: "./mods/show_level_cap.js",
            css: null,
            enabled: true
        },
        { id: "抽卡紀錄搜尋篩選",
            src: "./mods/actorpool_record_filter.js",
            css: "./mods/actorpool_record_filter.css",
            enabled: true
        },
        { id: "角色戰力個別顯示",
            src: "./mods/restore_power_display.js",
            css: null,
            enabled: true
        },
        { id: "編隊符文顯示",
            src: "./mods/formation_rune_display.js",
            css: "./mods/formation_rune_display.css",
            enabled: true
        },
        { id: "排名戰顯示對手名稱",
            src: "./mods/pvp_opponent_persist.js",
            css: null,
            enabled: true
        },
        { id: "夏夏の小工具",
            src: "./mods/rf_mod.js",
            css: "./mods/rf_mod.css",
            enabled: true
        },
        { id: "夏夏の音量調整工具",
            src: "./mods/rf_audio_panel.js",
            css: null,
            enabled: false
        },
        { id: "圖資缺漏檢查",
            src: "./mods/uw_hook.js",
            css: null,
            enabled: false
        },
        { id: "登入介面帳號管理",
            src: "./mods/rf_account_manager.js",
            css: null,
            enabled: true
        },
        { id: "戰鬥倍率面板",
            src: "./mods/battle_speed_panel.js",
            css: null,
            enabled: true
        },
        { id: "戰鬥狀態與效能診斷",
            src: "./mods/battle_state_diagnostic.js",
            css: null,
            enabled: false
        },
        { id: "戰鬥 FPS 實驗攔截",
            src: "./mods/battle_fps_override_experimental.js",
            css: null,
            enabled: false
        },
        { id: "Mod 效能分析器",
            src: "./mods/rf_mod_profiler.js",
            css: null,
            enabled: false
        },
        { id: "據點戰數據監測",
            src: "./mods/battle_stats_monitor.js",
            css: null,
            enabled: true
        },
        { id: "首頁齒輪效能優化",
            src: "./mods/home_gear_blocker.js",
            css: null,
            enabled: false
        },
        { id: "DCContext 監測",
            src: "./mods/dc_monitor_capture.js",
            css: null,
            enabled: true
        },
        { id: "RF 地下世界故事擷取",
            src: "./mods/rf_uw_capture.js - 捷徑.lnk",
            css: null,
            enabled: true
        },
        { id: "city_uploader",
            src: "./mods/city_uploader.js",
            css: null,
            enabled: true
        },
    ];

    const STORAGE_KEY = "uw_loader_config";
    const WINDOW_STORAGE_KEY = "__uw_loader_config__";

    function storageGet(){
        // fallback 優先：localStorage 可能保留著過期設定，但 window.name/cookie
        // 才是上一輪 quota fallback 寫入的最新設定。
        try {
            if (window.name.indexOf(WINDOW_STORAGE_KEY + "=") === 0) {
                return window.name.slice((WINDOW_STORAGE_KEY + "=").length);
            }
        } catch (e) {}
        try {
            const match = document.cookie.match(new RegExp("(?:^|; )" + STORAGE_KEY.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&") + "=([^;]*)"));
            if (match) return decodeURIComponent(match[1]);
        } catch (e) {}
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) return raw;
        } catch (e) {
            return null;
        }
        return null;
    }

    function storageSet(raw){
        let saved = false;
        try {
            window.localStorage.setItem(STORAGE_KEY, raw);
            saved = window.localStorage.getItem(STORAGE_KEY) === raw;
        } catch (e) {
            // localStorage quota 滿時不把原始例外刷到 Console，直接使用 fallback。
        }
        if (saved) return true;
        try {
            document.cookie = STORAGE_KEY + "=" + encodeURIComponent(raw) + "; path=/; max-age=31536000; SameSite=Lax";
            saved = document.cookie.indexOf(STORAGE_KEY + "=") >= 0;
        } catch (e) {}
        if (saved) return true;
        try {
            window.name = WINDOW_STORAGE_KEY + "=" + raw;
            return window.name === WINDOW_STORAGE_KEY + "=" + raw;
        } catch (e) { return false; }
    }

    function loadConfig(){
        try {
            const raw = storageGet();
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.warn("[LOADER] 設定格式無效，使用預設值", e);
            return {};
        }
    }

    function saveConfig(cfg){
        const raw = JSON.stringify(cfg);
        if (!storageSet(raw)) {
            console.warn("[LOADER] 設定儲存失敗：此頁面禁止 localStorage、cookie 與 window.name");
            return false;
        }
        console.log("[LOADER] 設定已保存");
        return true;
    }

    function isEnabled(tool, cfg){
        return Object.prototype.hasOwnProperty.call(cfg, tool.id) ? cfg[tool.id] : tool.enabled;
    }

    function injectScript(tool){
        if (!tool.src) return Promise.resolve();
        return new Promise((resolve) => {
            const s = document.createElement("script");
            s.src = tool.src + "?v=" + Date.now();
            s.async = false;
            s.dataset.uwTool = tool.id;
            s.onload = () => {
                console.log("[LOADER] 已載入 JS：" + tool.id);
                resolve();
            };
            s.onerror = () => {
                console.error("[LOADER] 載入 JS 失敗：" + tool.id + "（" + s.src + "）");
                resolve();
            };
            document.head.appendChild(s);
            console.log("[LOADER] 載入 JS：" + tool.id);
        });
    }

    function injectStyle(tool){
        if (!tool.css) return;
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = tool.css + "?v=" + Date.now();
        l.dataset.uwTool = tool.id;
        document.head.appendChild(l);
        console.log("[LOADER] 載入 CSS：" + tool.id);
    }

    async function loadEnabledTools(){
        const cfg = loadConfig();
        for (const core of CORE) {
            if (core.css) injectStyle(core);
            if (core.src) await injectScript(core);
        }
        for (const tool of TOOLS) {
            if (!isEnabled(tool, cfg)) continue;
            if (tool.css) injectStyle(tool);
            if (tool.src) await injectScript(tool);
        }
    }

    function buildPanel(){
        if (!window.UWPanel) {
            console.warn("[LOADER] 共用面板尚未載入，略過小工具管理器");
            return;
        }

        const cfg = loadConfig();
        const panel = window.UWPanel.create({
            id: "uw_loader",
            title: "[小工具管理器]",
            tabTitle: "小工具",
            side: "left",
            width: "220px",
            hint: "改動後重新整理頁面才會生效",
            defaultState: "expanded"
        });
        if (!panel) return;

        TOOLS.forEach(tool => {
            const row = document.createElement("label");
            row.className = "uw-panel-row";
            const checked = isEnabled(tool, cfg);
            const cssTag = tool.css ? ' <span style="opacity:.5;font-size:10px;">[css]</span>' : "";
            row.innerHTML = `<input type="checkbox" ${checked ? "checked" : ""} data-id="${tool.id}"><span>${tool.id}${cssTag}</span>`;
            panel.body.appendChild(row);
        });

        panel.body.addEventListener("change", function(e){
            if (e.target.matches("input[type=checkbox]")) {
                const id = e.target.dataset.id;
                const newCfg = loadConfig();
                newCfg[id] = e.target.checked;
                if (!saveConfig(newCfg)) {
                    e.target.checked = !e.target.checked;
                    alert("目前頁面禁止保存設定，請改用 http://localhost 開啟，或確認瀏覽器未封鎖本機儲存。");
                }
            }
        });
    }

    void loadEnabledTools().then(function(){
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", buildPanel);
        } else {
            buildPanel();
        }
    });
})();
