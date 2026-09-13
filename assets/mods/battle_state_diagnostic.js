/*
 * RF 戰鬥動畫狀態診斷器（自動版）
 * 載入後自動掃描，戰鬥 DOM 出現時自動重掃；只讀取，不修改遊戲。
 */
(function () {
    "use strict";
    if (window.RFBattleDiagnostic) return;

    var SPEED_RE = /(?:^|[^0-9])(?:0\.5|1|2|4|8)\s*[x×](?:[^0-9]|$)/i;
    var FIBER_RE = /^__react(Fiber|InternalInstance)\$/;
    var KEYWORDS = /battle|combat|attack|sprite|animation|anim|fps|speed|play/i;

    function textOf(node) {
        if (!node) return "";
        return [node.textContent, node.getAttribute && node.getAttribute("aria-label"), node.getAttribute && node.getAttribute("title"), node.getAttribute && node.getAttribute("data-speed")].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 300);
    }
    function compact(value, depth) {
        depth = depth || 0;
        if (depth > 2 || value == null) return value == null ? value : "[depth-limit]";
        if (typeof value !== "object") return typeof value === "function" ? "[function]" : value;
        if (Array.isArray(value)) return value.slice(0, 8).map(function (v) { return compact(v, depth + 1); });
        var out = {};
        Object.keys(value).slice(0, 40).forEach(function (key) {
            if (KEYWORDS.test(key) || depth === 0) { try { out[key] = compact(value[key], depth + 1); } catch (_) { out[key] = "[unreadable]"; } }
        });
        return out;
    }
    function fiberOf(node) {
        var key = node && Object.keys(node).find(function (k) { return FIBER_RE.test(k); });
        return key ? node[key] : null;
    }
    function scanDom() {
        return Array.from(document.querySelectorAll("button, [role=button], img, canvas, [class*=battle], [class*=attack], [class*=sprite], [class*=anim], [class*=speed]"))
            .filter(function (node) { return SPEED_RE.test(textOf(node)) || KEYWORDS.test((node.className || "") + " " + textOf(node)); }).slice(0, 100)
            .map(function (node, index) { var r = node.getBoundingClientRect(); return { index: index, tag: node.tagName, className: String(node.className || "").slice(0, 200), text: textOf(node), rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }; });
    }
    function scanFibers() {
        var result = [], seen = [];
        Array.from(document.querySelectorAll("*")).slice(0, 3000).forEach(function (node) {
            var fiber = fiberOf(node);
            if (!fiber || seen.indexOf(fiber) >= 0) return;
            seen.push(fiber);
            var current = fiber, level = 0;
            while (current && level++ < 30) {
                var props = current.memoizedProps || current.pendingProps, state = current.memoizedState;
                var data = JSON.stringify(compact(props)) + JSON.stringify(compact(state));
                if (KEYWORDS.test(props ? Object.keys(props).join(" ") : "") || /attackPlaySpeed|fps|speed|animation/i.test(data)) {
                    result.push({ element: node.tagName + "." + String(node.className || "").slice(0, 80), component: current.elementType && (current.elementType.name || current.elementType.displayName || String(current.elementType)), props: compact(props), state: compact(state), level: level });
                }
                current = current.return;
            }
        });
        return result.slice(0, 100);
    }
    function run() {
        var report = { time: new Date().toISOString(), nativeApi: null, domCandidates: scanDom(), fiberCandidates: scanFibers() };
        if (window.RFNativeBattleSpeed) report.nativeApi = { version: window.RFNativeBattleSpeed.version, hasNativeControl: typeof window.RFNativeBattleSpeed.hasNativeControl === "function" ? window.RFNativeBattleSpeed.hasNativeControl() : null, control: typeof window.RFNativeBattleSpeed.getNativeControl === "function" ? textOf(window.RFNativeBattleSpeed.getNativeControl()) : null };
        console.group("[RFBattleDiagnostic] 戰鬥狀態診斷"); console.log(report); console.table(report.domCandidates); console.table(report.fiberCandidates); console.groupEnd();
        window.__rfBattleDiagnosticLast = report; return report;
    }
    var queued = false, lastScan = 0;
    function autoRun(reason) {
        var now = Date.now();
        if (queued || now - lastScan < 1200) return;
        queued = true;
        Promise.resolve().then(function () { queued = false; lastScan = Date.now(); var report = run(); report.autoReason = reason; });
    }
    var perf = { started: new Date().toISOString(), longTasks: [], frames: 0, slowFrames: 0, domMutations: 0, domAdded: 0, windowMs: 10000 };
    var perfWindowStart = performance.now();
    function resetPerfWindow() {
        var now = performance.now();
        if (now - perfWindowStart > perf.windowMs) {
            perf.started = new Date().toISOString(); perf.longTasks = []; perf.frames = 0; perf.slowFrames = 0; perf.domMutations = 0; perf.domAdded = 0; perfWindowStart = now;
        }
    }
    function sampleFrame(now) {
        resetPerfWindow(); perf.frames += 1;
        if (perf.lastFrame != null && now - perf.lastFrame > 50) perf.slowFrames += 1;
        perf.lastFrame = now;
        if (window.requestAnimationFrame) window.requestAnimationFrame(sampleFrame);
    }
    if (window.requestAnimationFrame) window.requestAnimationFrame(sampleFrame);
    if (window.PerformanceObserver) {
        try {
            var po = new PerformanceObserver(function (list) {
                resetPerfWindow();
                list.getEntries().forEach(function (entry) { perf.longTasks.push({ start: Math.round(entry.startTime), duration: Math.round(entry.duration), attribution: entry.attribution && entry.attribution.map(function (a) { return a.name || a.containerName || "unknown"; }).slice(0, 5) }); });
                if (perf.longTasks.length > 50) perf.longTasks = perf.longTasks.slice(-50);
            });
            po.observe({ type: "longtask", buffered: true });
            window.__rfBattleDiagnosticPerformanceObserver = po;
        } catch (_) {}
    }
    function performanceSnapshot() {
        resetPerfWindow();
        return { started: perf.started, frames: perf.frames, slowFrames: perf.slowFrames, slowFrameRate: perf.frames ? Math.round(perf.slowFrames / perf.frames * 100) / 100 : 0, longTasks: perf.longTasks.slice(), domMutations: perf.domMutations, domAdded: perf.domAdded, note: "瀏覽器通常只能指出長任務與 DOM 變動，不能僅靠外掛準確把 CPU 時間歸因到某個 React 元件。" };
    }
    window.RFBattleDiagnostic = { version: "1.2-readonly-auto-perf", run: run, last: function () { return window.__rfBattleDiagnosticLast || null; }, performance: performanceSnapshot, auto: true };
    autoRun("initial-load");
    if (window.MutationObserver && document.body) {
        var observer = new MutationObserver(function (mutations) {
            resetPerfWindow(); perf.domMutations += mutations.length; mutations.forEach(function (m) { perf.domAdded += (m.addedNodes && m.addedNodes.length) || 0; });
            var relevant = mutations.some(function (m) { return Array.from(m.addedNodes || []).some(function (n) { return n.nodeType === 1 && (KEYWORDS.test(String(n.className || "")) || KEYWORDS.test(n.textContent || "")); }); });
            if (relevant) autoRun("battle-dom-change");
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.__rfBattleDiagnosticObserver = observer;
    }
    var originalRun = run;
    run = function () { var report = originalRun(); report.performance = performanceSnapshot(); window.__rfBattleDiagnosticLast = report; console.log("[RFBattleDiagnostic] 效能快照", report.performance); return report; };
    window.RFBattleDiagnostic.run = run;
    console.log("[RFBattleDiagnostic] 自動診斷與低侵入效能取樣已啟用；會記錄長任務、慢影格與 DOM 變動量，但不會直接攔截遊戲計時器。");
})();
