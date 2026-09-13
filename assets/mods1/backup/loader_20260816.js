// loader.js - 統一管理所有小工具的載入
// index.html 只需要掛這一支，其他工具都寫在下面的 TOOLS 清單裡集中管理
console.log("[LOADER] 小工具載入器啟動");

(function(){
    // ---- 在這裡集中管理所有小工具 ----
    // id: 顯示用名稱
    // src: JS 檔案路徑（沒有的話留 null）
    // css: CSS 檔案路徑（沒有的話留 null）
    // enabled: 預設要不要載入（之後也可以在畫面上的管理面板即時開關，存在 localStorage）
    const TOOLS = [
        { id: "custom_attackmap",       src: "./custom_attackmap.js",       css: "./custom_attackmap.css", enabled: true  },
        { id: "uw_hook",                src: "./uw_hook.js",                css: null,                     enabled: true  },
        { id: "show_level_cap",         src: "./show_level_cap.js",         css: null,                     enabled: true  },
        { id: "restore_power_display",  src: "./restore_power_display.js",  css: null,                     enabled: true  },
        { id: "pvp_opponent_persist",   src: "./pvp_opponent_persist.js",   css: null,                     enabled: true  },
        { id: "rf_mod",                 src: "./rf_mod.js",                 css: "./rf_mod.css",           enabled: false }, // 目前沒用處，預設關閉
        { id: "rf_account_manager",     src: "./rf_account_manager.js",     css: null,                     enabled: true  }
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
        s.src = tool.src;
        s.defer = true;
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
        l.href = tool.css;
        l.dataset.uwTool = tool.id;
        l.onerror = function(){
            console.warn("[LOADER] 載入失敗：" + tool.id + "（" + tool.css + "）找不到檔案或路徑錯誤");
        };
        document.head.appendChild(l);
        console.log("[LOADER] 載入 CSS：" + tool.id);
    }

    function loadEnabledTools(){
        const cfg = loadConfig();
        TOOLS.forEach(tool => {
            if (!isEnabled(tool, cfg)) return;
            if (tool.css) injectStyle(tool); // CSS 先載入，避免無樣式畫面閃一下(FOUC)
            if (tool.src) injectScript(tool);
        });
    }

    // ---- 畫面上的管理面板：開關每支工具（改動後需要重新整理頁面才會生效）----
    function buildPanel(){
        const cfg = loadConfig();

        const style = document.createElement("style");
        style.textContent = `
            #uw-loader-panel{
                position:fixed; left:14px; bottom:14px; z-index:2147483647;
                width:220px; font-family:ui-monospace,Menlo,Consolas,monospace;
                background:#14160f; color:#e8e4d5; border:1px solid #3a3f2c;
                border-radius:4px; box-shadow:0 4px 18px rgba(0,0,0,.5);
                font-size:12px; overflow:hidden;
            }
            #uw-loader-panel .uw-head{
                background:#1c2018; padding:8px 10px; display:flex;
                align-items:center; justify-content:space-between; cursor:move;
                border-bottom:1px solid #3a3f2c;
            }
            #uw-loader-panel .uw-head b{color:#d9a441; font-weight:600; font-size:11.5px;}
            #uw-loader-panel .uw-body{padding:8px 10px; max-height:260px; overflow:auto;}
            #uw-loader-panel .uw-row{
                display:flex; align-items:center; gap:8px; padding:4px 0;
                border-bottom:1px solid #23271a;
            }
            #uw-loader-panel .uw-row:last-child{border-bottom:none;}
            #uw-loader-panel .uw-row span{flex:1; word-break:break-all;}
            #uw-loader-panel .uw-hint{color:#8b9284; font-size:10.5px; padding:6px 10px; border-top:1px solid #3a3f2c;}
            #uw-loader-panel .uw-min{cursor:pointer; color:#8b9284; font-size:13px; user-select:none;}
        `;
        document.head.appendChild(style);

        const panel = document.createElement("div");
        panel.id = "uw-loader-panel";
        panel.innerHTML = `
            <div class="uw-head" id="uw-loader-drag">
                <b>[小工具管理器]</b>
                <span class="uw-min" id="uw-loader-min">—</span>
            </div>
            <div class="uw-body" id="uw-loader-body"></div>
            <div class="uw-hint">改動後重新整理頁面才會生效</div>
        `;
        document.body.appendChild(panel);

        const body = panel.querySelector("#uw-loader-body");
        TOOLS.forEach(tool => {
            const row = document.createElement("label");
            row.className = "uw-row";
            const checked = isEnabled(tool, cfg);
            const cssTag = tool.css ? ' <span style="opacity:.5;font-size:10px;">[css]</span>' : "";
            row.innerHTML = `<input type="checkbox" ${checked ? "checked" : ""} data-id="${tool.id}"><span>${tool.id}${cssTag}</span>`;
            body.appendChild(row);
        });

        body.addEventListener("change", function(e){
            if (e.target.matches("input[type=checkbox]")) {
                const id = e.target.dataset.id;
                const newCfg = loadConfig();
                newCfg[id] = e.target.checked;
                saveConfig(newCfg);
            }
        });

        // 收合/展開
        const minBtn = panel.querySelector("#uw-loader-min");
        let collapsed = false;
        minBtn.addEventListener("click", function(){
            collapsed = !collapsed;
            body.style.display = collapsed ? "none" : "block";
            panel.querySelector(".uw-hint").style.display = collapsed ? "none" : "block";
            minBtn.textContent = collapsed ? "+" : "—";
        });

        // 拖曳
        const dragHandle = panel.querySelector("#uw-loader-drag");
        let dragging = false, offX = 0, offY = 0;
        dragHandle.addEventListener("mousedown", function(e){
            dragging = true;
            const rect = panel.getBoundingClientRect();
            offX = e.clientX - rect.left;
            offY = e.clientY - rect.top;
        });
        document.addEventListener("mousemove", function(e){
            if (!dragging) return;
            panel.style.left = (e.clientX - offX) + "px";
            panel.style.top = (e.clientY - offY) + "px";
            panel.style.bottom = "auto";
        });
        document.addEventListener("mouseup", function(){ dragging = false; });
    }

    loadEnabledTools();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildPanel);
    } else {
        buildPanel();
    }
})();
