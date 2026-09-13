/**
 * RF Mod 效能分析器 (Mod Profiler) - v2.1 熱點偵測版
 * 
 * 功能：
 * 1. 攔截計時器與監控 DOM 變動。
 * 2. 新增：熱點變動偵測，追蹤到底是哪些元素在頻繁觸發 MutationObserver。
 * 3. 支援收合/隱藏/拖曳的管理面板。
 * 4. 一鍵產生報告並複製到剪貼簿。
 */
(function() {
    "use strict";
    if (window.__rfModProfiler) return;
    window.__rfModProfiler = true;

    var ID = "rf-mod-profiler-panel";
    var stats = {
        timers: new Map(),
        observers: { count: 0 },
        hotElements: new Map(), // 追蹤熱點元素
        domNodes: 0,
        memorySnapshots: [],
        startTime: Date.now()
    };

    // 1. 攔截計時器
    const _origSetInterval = window.setInterval;
    window.setInterval = function(handler, delay) {
        const name = handler.name || "anon_" + Math.random().toString(36).slice(2, 5);
        const wrapped = function() {
            const start = performance.now();
            handler.apply(this, arguments);
            const duration = performance.now() - start;
            if (!stats.timers.has(name)) stats.timers.set(name, { count: 0, totalMs: 0, maxMs: 0 });
            const s = stats.timers.get(name);
            s.count++; s.totalMs += duration;
            if (duration > s.maxMs) s.maxMs = duration;
        };
        return _origSetInterval(wrapped, delay);
    };

    // 2. 監控 DOM 與熱點
    new MutationObserver(mutations => {
        stats.observers.count += mutations.length;
        mutations.forEach(m => {
            const target = m.target;
            const identifier = target.tagName + (target.className ? '.' + target.className.split(' ').join('.') : '');
            stats.hotElements.set(identifier, (stats.hotElements.get(identifier) || 0) + 1);
        });
        stats.domNodes = document.querySelectorAll('*').length;
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    // 3. 記憶體快照
    _origSetInterval(() => {
        if (performance.memory) {
            stats.memorySnapshots.push({
                time: new Date().toLocaleTimeString(),
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                nodes: stats.domNodes
            });
            if (stats.memorySnapshots.length > 10) stats.memorySnapshots.shift();
        }
    }, 10000);

    // 4. 報告邏輯
    function generateReport() {
        const durationSec = (Date.now() - stats.startTime) / 1000;
        const hotEntries = [...stats.hotElements.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let text = `=== RF Mod 效能診斷報告 (${new Date().toLocaleString()}) ===\n\n`;
        text += `DOM 節點數: ${stats.domNodes}\n`;
        text += `DOM 變動總數: ${stats.observers.count}\n`;
        text += `平均變動頻率: ${(stats.observers.count / durationSec).toFixed(1)} 次/秒\n\n`;
        
        text += `[熱點變動元素]\n`;
        hotEntries.forEach(([el, count]) => {
            text += `- ${el}: ${count} 次\n`;
        });

        text += `\n[計時器排行]\n`;
        const timerList = [];
        stats.timers.forEach((v, k) => timerList.push({ name: k, count: v.count, total: v.totalMs }));
        timerList.sort((a, b) => b.total - a.total).slice(0, 10).forEach(t => {
            text += `- ${t.name}: ${t.count}次, 總計 ${Math.round(t.total)}ms\n`;
        });
        
        text += `\n[記憶體趨勢]\n`;
        stats.memorySnapshots.forEach(s => text += `- ${s.time}: ${s.used}MB\n`);
        
        console.log(text);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => alert("報告已複製到剪貼簿！"));
        }
    }

    // 5. 建立面板
    function build() {
        if (document.getElementById(ID)) return;
        const style = document.createElement("style");
        style.textContent = `
            #${ID}{position:fixed; left:14px; top:100px; z-index:2147483647; width:200px; background:#14160f; color:#e8e4d5; border:1px solid #e91e63; border-radius:4px; font-size:12px; font-family:ui-monospace,Menlo,Consolas,monospace; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.5);}
            #${ID} .p-head{background:#1c2018; padding:8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:move; border-bottom:1px solid #3a3f2c;}
            #${ID} .p-head b{color:#e91e63; font-weight:600;}
            #${ID} .p-actions{display:flex; gap:7px;}
            #${ID} .p-btn{cursor:pointer; color:#8b9284; font-size:13px; user-select:none;}
            #${ID} .p-body{padding:10px;}
            #${ID} .p-stat{margin-bottom:5px; color:#e5bd72;}
            #${ID} button{width:100%; margin-top:6px; background:#252a1d; color:#e8e4d5; border:1px solid #555d45; border-radius:4px; padding:5px; cursor:pointer;}
            #${ID} button:hover{background:#39412b;}
        `;
        document.head.appendChild(style);
        
        const panel = document.createElement("div");
        panel.id = ID;
        panel.innerHTML = `
            <div class="p-head" id="${ID}-drag">
                <b>[效能分析器]</b>
                <span class="p-actions">
                    <span class="p-btn" id="${ID}-hide">×</span>
                    <span class="p-btn" id="${ID}-min">—</span>
                </span>
            </div>
            <div class="p-body" id="${ID}-body">
                <div class="p-stat" id="${ID}-mem">記憶體: -- MB</div>
                <div class="p-stat" id="${ID}-dom">節點數: --</div>
                <div class="p-stat" id="${ID}-mut" style="color:#ff5252;">變動: -- 次</div>
                <button id="${ID}-run">產生報告並複製</button>
                <button id="${ID}-reset">重置數據數據</button>
            </div>
        `;
        document.body.appendChild(panel);

        const body = panel.querySelector(`#${ID}-body`);
        const minBtn = panel.querySelector(`#${ID}-min`);
        let collapsed = false;

        panel.querySelector(`#${ID}-run`).onclick = generateReport;
        panel.querySelector(`#${ID}-reset`).onclick = () => { stats.timers.clear(); stats.observers.count = 0; stats.hotElements.clear(); alert("數據已重置"); };
        panel.querySelector(`#${ID}-hide`).onclick = () => panel.style.display = "none";
        minBtn.onclick = () => {
            collapsed = !collapsed;
            body.style.display = collapsed ? "none" : "block";
            minBtn.textContent = collapsed ? "+" : "—";
        };

        // 拖曳邏輯
        const dragHandle = panel.querySelector(`#${ID}-drag`);
        let dragging = false, offX = 0, offY = 0;
        dragHandle.onmousedown = (e) => {
            if (e.target.classList.contains("p-btn")) return;
            dragging = true;
            const rect = panel.getBoundingClientRect();
            offX = e.clientX - rect.left; offY = e.clientY - rect.top;
        };
        document.onmousemove = (e) => {
            if (!dragging) return;
            panel.style.left = (e.clientX - offX) + "px";
            panel.style.top = (e.clientY - offY) + "px";
            panel.style.bottom = "auto"; panel.style.right = "auto";
        };
        document.onmouseup = () => dragging = false;

        setInterval(() => {
            const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : "--";
            const memEl = document.getElementById(`${ID}-mem`);
            const domEl = document.getElementById(`${ID}-dom`);
            const mutEl = document.getElementById(`${ID}-mut`);
            if (memEl) memEl.textContent = `記憶體: ${mem} MB`;
            if (domEl) domEl.textContent = `節點數: ${stats.domNodes}`;
            if (mutEl) mutEl.textContent = `變動: ${stats.observers.count} 次`;
        }, 2000);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
})();
