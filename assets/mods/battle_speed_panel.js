/**
 * 戰鬥倍率面板 (Battle Speed Panel) - 現行主程式相容版
 * 據點戰使用 attackPlaySpeed React state；PVP 則直接調整目前 spritesheet 實例。
 */

(function() {
    "use strict";
    if (window.RFBattleSpeedPanelV4) return;
    window.RFBattleSpeedPanelV4 = true;

    const VALUES = [0.25, 0.5, 1, 2, 4, 8];
    let currentMultiplier = 1;
    const originalFps = new WeakMap();
    const SPRITESHEET_SELECTOR = [
        '.react-responsive-spritesheet',
        '[class*="Character_spritesheet__"]',
        '[class*="Character_spritesheet_effect__"]'
    ].join(',');

    function isBattlePage() {
        const h = window.location.hash.toLowerCase();
        // 使用更廣泛的關鍵字匹配，寧可抓錯不可放過
        return h.includes('attack') || 
               h.includes('battle') || 
               h.includes('pick');
    }

    function fiberOf(node) {
        if (!node) return null;
        const k = Object.keys(node).find(x => x.startsWith('__reactFiber$') || x.startsWith('__reactInternalInstance$'));
        return k ? node[k] : null;
    }

    function isSpritesheetInstance(value) {
        return value && typeof value.setFps === 'function' && typeof value.getInfo === 'function';
    }

    function findInValue(value, seen, depth) {
        if (!value || depth > 5 || (typeof value !== 'object' && typeof value !== 'function')) return null;
        if (isSpritesheetInstance(value)) return value;
        if (seen.has(value)) return null;
        seen.add(value);

        if (value.current && isSpritesheetInstance(value.current)) return value.current;
        for (const key of Object.keys(value)) {
            if (key === 'return' || key === 'child' || key === 'sibling' || key === 'alternate') continue;
            const found = findInValue(value[key], seen, depth + 1);
            if (found) return found;
        }
        return null;
    }

    function findContextInValue(value, seen, depth) {
        if (!value || depth > 6 || (typeof value !== 'object' && typeof value !== 'function')) return null;
        if (typeof value.setAttackPlaySpeed === 'function' && typeof value.attackPlaySpeed === 'number') return value;
        if (seen.has(value)) return null;
        seen.add(value);
        for (const key of Object.keys(value)) {
            if (key === 'return' || key === 'child' || key === 'sibling' || key === 'alternate') continue;
            const found = findContextInValue(value[key], seen, depth + 1);
            if (found) return found;
        }
        return null;
    }

    function findInstance(rootEl) {
        let f = fiberOf(rootEl);
        let depth = 0;
        const seen = new Set();
        while (f && depth++ < 60) {
            const instance = findInValue(f.stateNode, seen, 1) || findInValue(f.ref, seen, 1);
            if (instance) return instance;

            // Newer builds use forwardRef and keep getRefCallback results in hook state.
            let hook = f.memoizedState;
            let hookDepth = 0;
            while (hook && hookDepth++ < 30) {
                const instance = findInValue(hook.memoizedState, seen, 1);
                if (instance) return instance;
                hook = hook.next;
            }
            f = f.return;
        }
        return null;
    }

    function findSpeedContext(rootEl) {
        let f = fiberOf(rootEl);
        const seen = new Set();
        while (f && f.return) f = f.return;

        function walk(fiber, depth) {
            if (!fiber || depth > 300 || seen.has(fiber)) return null;
            seen.add(fiber);
            for (const props of [fiber.memoizedProps, fiber.pendingProps]) {
                const context = findContextInValue(props, new Set(), 1);
                if (context) return context;
            }
            let hook = fiber.memoizedState;
            for (let index = 0; hook && index < 40; index += 1, hook = hook.next) {
                const context = findContextInValue(hook.memoizedState, new Set(), 1);
                if (context) return context;
            }
            return walk(fiber.child, depth + 1) || walk(fiber.sibling, depth);
        }
        return walk(f, 0);
    }

    function setStatus(text) {
        const statusEl = document.getElementById('rf-speed-status');
        if (statusEl) statusEl.textContent = text;
    }

    function applySpeed(multiplier) {
        currentMultiplier = multiplier;
        const spritesheets = document.querySelectorAll(SPRITESHEET_SELECTOR);
        const nativeSpeedButton = document.querySelector('[class*="BattleStage_iconSpeed"]');
        if (!spritesheets.length && !nativeSpeedButton) {
            setStatus("尚未進入可調速的戰鬥畫面");
            return;
        }

        // 現行據點戰保留原生 1x/2x 按鈕，但其 state setter 可接受其他倍率。
        // 不再模擬點擊，避免原本速度未知時切到錯誤倍率。
        const speedContext = nativeSpeedButton ? findSpeedContext(nativeSpeedButton) : null;
        if (speedContext && typeof speedContext.setAttackPlaySpeed === 'function') {
            if (speedContext.attackPlaySpeed !== multiplier) speedContext.setAttackPlaySpeed(multiplier);
            setStatus(`據點戰速度已設為 ${multiplier}x`);
            return;
        }

        let count = 0;
        const instances = new Set();
        spritesheets.forEach(el => {
            const sn = findInstance(el);
            if (!sn || instances.has(sn)) return;
            instances.add(sn);
            const fps = Number(sn.getInfo('fps'));
            if (!originalFps.has(sn)) originalFps.set(sn, Number.isFinite(fps) && fps > 0 ? fps : 24);
            try { sn.setFps(Math.max(1, Math.round(originalFps.get(sn) * multiplier))); count++; } catch(e) {}
        });
        setStatus(count > 0 ? `PVP 動畫 ${count} 組已套用 ${multiplier}x` : "找不到可調整的動畫實例");
    }

    function buildUI() {
        const ID = "rf-battle-speed-panel";
        const old = document.getElementById(ID);
        if (old) old.remove();
        
        const style = document.createElement("style");
        style.textContent = `
            #${ID}{position:fixed; right:14px; bottom:14px; z-index:9999; width:320px; background:#14160f; color:#e8e4d5; border:1px solid #e5bd72; border-radius:4px; font-size:12px; font-family:monospace; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.5);}
            #${ID} .p-head{background:#1c2018; padding:8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:move; border-bottom:1px solid #3a3f2c;}
            #${ID} .p-head b{color:#e5bd72; font-size:11px;}
            #${ID} .p-btn{cursor:pointer; color:#8b9284; margin-left:8px;}
            #${ID} .p-body{padding:10px;}
            #${ID} .p-grid{display:flex; flex-direction:row; justify-content:space-between; gap:4px;}
            #${ID} .speed-btn{flex:1; background:#252a1d; border:1px solid #555d45; border-radius:4px; padding:6px 0; color:#e8e4d5; cursor:pointer; font-size:11px; white-space:nowrap;}
            #${ID} .speed-btn.active{background:#e5bd72; color:#14160f; border-color:#e5bd72; font-weight:bold;}
            #${ID} .p-status{color:#e5bd72; font-size:11px; margin-top:8px; opacity:0.8;}
        `;
        document.head.appendChild(style);

        const panel = document.createElement("div");
        panel.id = ID;
        panel.innerHTML = `
            <div class="p-head" id="${ID}-drag">
                <b>[戰鬥倍率 v3 實例級]</b>
                <span>
                    <span class="p-btn" id="${ID}-hide">×</span>
                    <span class="p-btn" id="${ID}-min">—</span>
                </span>
            </div>
            <div class="p-body" id="${ID}-body">
                <div class="p-grid"></div>
                <div class="p-status" id="rf-speed-status">尋找實例...</div>
            </div>
        `;
        document.body.appendChild(panel);

        const grid = panel.querySelector('.p-grid');
        VALUES.forEach(v => {
            const btn = document.createElement("button");
            btn.className = "speed-btn" + (v === currentMultiplier ? " active" : "");
            btn.textContent = v + "x";
            btn.onclick = () => {
                currentMultiplier = v;
                grid.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applySpeed(v);
            };
            grid.appendChild(btn);
        });

        panel.querySelector(`#${ID}-hide`).onclick = () => panel.style.display = "none";
        const body = panel.querySelector(`#${ID}-body`);
        const minBtn = panel.querySelector(`#${ID}-min`);
        let collapsed = false;
        minBtn.onclick = () => {
            collapsed = !collapsed;
            body.style.display = collapsed ? "none" : "block";
            panel.querySelector(".p-status").style.display = collapsed ? "none" : "block";
            minBtn.textContent = collapsed ? "+" : "—";
        };

        const dragHandle = panel.querySelector(`#${ID}-drag`);
        let dragging = false, ox, oy;
        dragHandle.onmousedown = (e) => { if(e.target.classList.contains("p-btn")) return; dragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop; };
        document.addEventListener("mousemove", (e) => { if(dragging){ panel.style.left = e.clientX - ox + "px"; panel.style.top = e.clientY - oy + "px"; panel.style.right = "auto"; panel.style.bottom = "auto"; }});
        document.addEventListener("mouseup", () => dragging = false);
    }

    buildUI();

    // PVP 每次進入新回合都會換一批 spritesheet；保留使用者選擇的倍率並套到新實例。
    let applyQueued = false;
    const battleObserver = new MutationObserver(mutations => {
        if (currentMultiplier === 1 || applyQueued) return;
        const hasBattleNode = mutations.some(m => Array.from(m.addedNodes).some(node => {
            if (node.nodeType !== 1) return false;
            return node.matches?.(SPRITESHEET_SELECTOR) || node.querySelector?.(SPRITESHEET_SELECTOR) ||
                String(node.className || '').includes('BattleStage_');
        }));
        if (!hasBattleNode) return;
        applyQueued = true;
        setTimeout(() => {
            applyQueued = false;
            applySpeed(currentMultiplier);
        }, 80);
    });
    if (document.body) battleObserver.observe(document.body, { childList: true, subtree: true });
})();
