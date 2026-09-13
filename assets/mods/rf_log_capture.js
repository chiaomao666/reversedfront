/*
 * RF Log Capture Module
 * 放入 assets/mods/ 後，由 rf_mod_loader.js 載入即可。
 * 功能：攔截 console.log/info/warn/error/debug、敏感資料遮罩、
 * localStorage 持久化、浮動面板、一鍵複製、下載 .txt、清除。
 */
(function (global) {
  "use strict";
  if (global.RFLogCapture && global.RFLogCapture.started) return;

  // 即使這支檔案被直接插入，也要尊重 rf_mod_loader.js 的停用設定。
  // loader 使用 uw_loader_config 儲存各工具狀態；未設定時沿用工具的預設 enabled=true。
  try {
    var loaderRaw = null;
    if (global.name && global.name.indexOf("__uw_loader_config__=") === 0) {
      loaderRaw = global.name.slice("__uw_loader_config__=".length);
    }
    if (!loaderRaw) {
      try {
        var loaderCookie = document.cookie.match(/(?:^|; )uw_loader_config=([^;]*)/);
        loaderRaw = loaderCookie ? decodeURIComponent(loaderCookie[1]) : null;
      } catch (error) {}
    }
    if (!loaderRaw) {
      try { loaderRaw = global.localStorage.getItem("uw_loader_config"); } catch (error) {}
    }
    var loaderConfig = JSON.parse(loaderRaw || "{}");
    var toolId = "RF Log Console 擷取與分析";
    if (Object.prototype.hasOwnProperty.call(loaderConfig, toolId) && loaderConfig[toolId] === false) return;
  } catch (error) {}

  var STORAGE_KEY = "rf-log-observatory-logs-v1";
  var PANEL_POSITION_KEY = "rf-log-capture-panel-position-v1";
  var MAX_LOGS = 5000;
  var methods = ["log", "info", "warn", "error", "debug"];
  var original = {};
  var config = Object.assign({
    persist: true,
    redactSensitive: true,
    maxLogs: MAX_LOGS,
    source: "console",
    panel: true
  }, global.RF_LOG_CAPTURE_CONFIG || {});

  function redact(text) {
    if (!config.redactSensitive) return String(text);
    return String(text)
      .replace(/(password|passwd|token|secret|authorization|cookie|receipt|device_uid)\s*([:=])\s*([^\s,;}]+)/gi, "$1$2[REDACTED]")
      .replace(/(bearer\s+)[a-z0-9._\-]+/gi, "$1[REDACTED]");
  }

  function serialize(value) {
    if (typeof value === "string") return redact(value);
    if (value instanceof Error) return redact(value.name + ": " + value.message + (value.stack ? "\n" + value.stack : ""));
    try {
      var seen = [];
      var output = JSON.stringify(value, function (key, nested) {
        if (typeof nested === "object" && nested !== null) {
          if (seen.indexOf(nested) >= 0) return "[Circular]";
          seen.push(nested);
        }
        if (typeof nested === "bigint") return String(nested) + "n";
        if (config.redactSensitive && /^(password|passwd|token|secret|authorization|cookie|receipt|device_uid)$/i.test(key)) return "[REDACTED]";
        return nested;
      });
      return redact(output);
    } catch (error) {
      return redact(String(value));
    }
  }

  function readStored() {
    try { return JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "[]"); } catch (error) { return []; }
  }

  function writeStored(entries) {
    if (!config.persist) return;
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-config.maxLogs))); } catch (error) { /* quota errors are non-fatal */ }
  }

  function formatEntry(entry) {
    return "[" + entry.ts + "] [" + entry.level.toUpperCase() + "] " + entry.message;
  }

  function exportText() { return readStored().map(formatEntry).join("\n"); }

  function notifyAnalyzer(entry) {
    try {
      global.dispatchEvent(new CustomEvent("rf-log-captured", { detail: entry }));
      if (global.opener && global.opener !== global) {
        global.opener.postMessage({ source: "rf-log-capture", type: "rf-log", entry: entry }, "*");
      }
    } catch (error) { /* event APIs are optional */ }
  }

  function updatePanel() {
    var count = document.getElementById("rf-log-capture-count");
    if (count) count.textContent = String(readStored().length);
  }

  function readPanelPosition() {
    try {
      var saved = JSON.parse(global.localStorage.getItem(PANEL_POSITION_KEY) || "null");
      return saved && typeof saved.left === "number" && typeof saved.top === "number" ? saved : null;
    } catch (error) { return null; }
  }

  function savePanelPosition(left, top) {
    try { global.localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify({ left: left, top: top })); } catch (error) {}
  }

  function clampPanelPosition(panel, left, top) {
    var margin = 8;
    var maxLeft = Math.max(margin, global.innerWidth - panel.offsetWidth - margin);
    var maxTop = Math.max(margin, global.innerHeight - panel.offsetHeight - margin);
    return { left: Math.min(Math.max(margin, left), maxLeft), top: Math.min(Math.max(margin, top), maxTop) };
  }

  function applyPanelPosition(panel, position) {
    if (!position) return;
    var safe = clampPanelPosition(panel, position.left, position.top);
    panel.style.left = safe.left + "px";
    panel.style.top = safe.top + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }

  function enablePanelDragging(panel, handle) {
    var dragging = false;
    var offsetX = 0;
    var offsetY = 0;
    handle.addEventListener("pointerdown", function (event) {
      if (event.target.closest("button")) return;
      dragging = true;
      handle.setPointerCapture(event.pointerId);
      var rect = panel.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      panel.classList.add("rf-dragging");
      event.preventDefault();
    });
    handle.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var safe = clampPanelPosition(panel, event.clientX - offsetX, event.clientY - offsetY);
      panel.style.left = safe.left + "px";
      panel.style.top = safe.top + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    });
    function finishDrag(event) {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove("rf-dragging");
      try { handle.releasePointerCapture(event.pointerId); } catch (error) {}
      var rect = panel.getBoundingClientRect();
      savePanelPosition(rect.left, rect.top);
    }
    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);
    handle.addEventListener("dblclick", function () {
      try { global.localStorage.removeItem(PANEL_POSITION_KEY); } catch (error) {}
      panel.style.left = "auto";
      panel.style.top = "auto";
      panel.style.right = "16px";
      panel.style.bottom = "16px";
    });
    global.addEventListener("resize", function () {
      var rect = panel.getBoundingClientRect();
      applyPanelPosition(panel, { left: rect.left, top: rect.top });
      var next = panel.getBoundingClientRect();
      savePanelPosition(next.left, next.top);
    });
  }

  function capture(level, args) {
    var parts = Array.prototype.map.call(args || [], serialize);
    var message = parts.join(" ");
    var entry = {
      id: "rf-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      ts: new Date().toISOString(),
      level: level,
      message: message,
      args: parts,
      source: (message.match(/^\[([^\]]+)\]/) || [])[1] || config.source
    };
    var entries = readStored();
    entries.push(entry);
    writeStored(entries);
    notifyAnalyzer(entry);
    updatePanel();
    return entry;
  }

  function downloadText() {
    var blob = new Blob([exportText()], { type: "text/plain;charset=utf-8" });
    var url = global.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rf-logs-" + new Date().toISOString().slice(0, 10) + ".txt";
    anchor.click();
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 500);
  }

  function copyText() {
    var text = exportText();
    if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
      global.navigator.clipboard.writeText(text).then(function () { alert("RF Log：已複製 " + readStored().length + " 筆 Log"); });
    } else {
      var textarea = document.createElement("textarea");
      textarea.value = text; textarea.style.position = "fixed"; textarea.style.opacity = "0";
      document.body.appendChild(textarea); textarea.select(); document.execCommand("copy"); textarea.remove();
      alert("RF Log：已複製 " + readStored().length + " 筆 Log");
    }
  }

  function buildPanel() {
    if (!config.panel || document.getElementById("rf-log-capture-panel")) return;
    var style = document.createElement("style");
    style.id = "rf-log-capture-style";
    style.textContent = "#rf-log-capture-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:260px;color:#d8eee8;background:#0a1516;border:1px solid #2d5b54;border-radius:10px;box-shadow:0 12px 34px rgba(0,0,0,.4);font:12px system-ui,sans-serif;overflow:hidden}#rf-log-capture-panel .rf-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#102322;border-bottom:1px solid #23443f;cursor:move;touch-action:none;user-select:none}#rf-log-capture-panel.rf-dragging{opacity:.9;box-shadow:0 18px 45px rgba(0,0,0,.55)}#rf-log-capture-panel .rf-title{color:#8ce8d1;font-weight:700}#rf-log-capture-panel .rf-title:after{content:' · 拖曳移動／雙擊復位';color:#5d8c82;font-size:9px;font-weight:400;margin-left:5px}#rf-log-capture-panel .rf-count{color:#5eead4;font:12px monospace}#rf-log-capture-panel .rf-body{padding:10px 12px}#rf-log-capture-panel .rf-hint{color:#76928c;font-size:10px;line-height:1.5;margin-bottom:9px}#rf-log-capture-panel .rf-actions{display:flex;gap:6px;flex-wrap:wrap}#rf-log-capture-panel button{border:1px solid #315951;border-radius:6px;background:#122a28;color:#b9d9d1;padding:6px 8px;font-size:10px;cursor:pointer}#rf-log-capture-panel button:hover{background:#1a3b36;color:#fff}#rf-log-capture-panel .rf-close{border:0;background:transparent;padding:0 3px;color:#7fa19a;font-size:16px;cursor:pointer}#rf-log-capture-panel label{display:flex;gap:6px;align-items:center;color:#88a7a0;font-size:10px;margin-top:9px}";
    document.head.appendChild(style);
    var panel = document.createElement("div");
    panel.id = "rf-log-capture-panel";
    panel.innerHTML = "<div class=\"rf-head\"><span class=\"rf-title\">RF LOG CAPTURE</span><span><span id=\"rf-log-capture-count\" class=\"rf-count\">0</span> <button class=\"rf-close\" title=\"隱藏面板\">×</button></span></div><div class=\"rf-body\"><div class=\"rf-hint\">正在攔截 Console 輸出；資料只保留在目前網頁的 localStorage。</div><div class=\"rf-actions\"><button data-action=\"copy\">一鍵複製</button><button data-action=\"download\">下載 .txt</button><button data-action=\"clear\">清除</button></div><label><input id=\"rf-redact-toggle\" type=\"checkbox\" checked> 遮罩敏感欄位</label></div>";
    document.body.appendChild(panel);
    applyPanelPosition(panel, readPanelPosition());
    enablePanelDragging(panel, panel.querySelector(".rf-head"));
    panel.querySelector("[data-action=copy]").onclick = copyText;
    panel.querySelector("[data-action=download]").onclick = downloadText;
    panel.querySelector("[data-action=clear]").onclick = function () { if (confirm("清除目前頁面保存的所有 Log？")) { try { global.localStorage.removeItem(STORAGE_KEY); } catch (error) {} updatePanel(); } };
    panel.querySelector(".rf-close").onclick = function () { panel.style.display = "none"; };
    panel.querySelector("#rf-redact-toggle").onchange = function (event) { config.redactSensitive = event.target.checked; };
    updatePanel();
  }

  methods.forEach(function (level) {
    original[level] = global.console && global.console[level] ? global.console[level].bind(global.console) : function () {};
    if (!global.console) return;
    global.console[level] = function () {
      capture(level, arguments);
      return original[level].apply(null, arguments);
    };
  });

  global.RFLogCapture = {
    started: true,
    config: config,
    getLogs: readStored,
    clear: function () { try { global.localStorage.removeItem(STORAGE_KEY); } catch (error) {} updatePanel(); },
    exportText: exportText,
    copy: copyText,
    download: downloadText,
    stop: function () {
      methods.forEach(function (level) { if (global.console) global.console[level] = original[level]; });
      global.RFLogCapture.started = false;
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildPanel);
  else buildPanel();
  original.log("[RFLogCapture] started", { redactSensitive: config.redactSensitive, maxLogs: config.maxLogs });
})(window);
