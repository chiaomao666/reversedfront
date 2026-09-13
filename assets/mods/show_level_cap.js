// show_level_cap.js - 把角色卡片等級顯示從「N」補回「N/上限」
// 做法：畫面 DOM 裡已經沒有 level_cap 這個文字了（main.js 被改過，不渲染上限）
// 所以改成從該元素對應的 React Fiber 往上找，把原始資料物件（含 level / level_cap）撈出來
console.log("[LVCAP] 啟動外部副程式：等級上限還原器已載入");

(function(){
    const CLASS_PREFIX = "Actorcard_actorLv_";
    const ALREADY_LEVEL_ONLY = /^\d+$/;          // 目前畫面上：純數字，沒有斜線
    const ALREADY_HAS_CAP = /^\d+\s*\/\s*\d+$/;   // 已經是 N/上限 格式，不用再處理

    function hasTargetClass(el){
        return el && el.className && typeof el.className === "string" &&
               el.className.split(/\s+/).some(c => c.indexOf(CLASS_PREFIX) === 0);
    }

    function getFiber(el){
        const key = Object.keys(el).find(k =>
            k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
        );
        return key ? el[key] : null;
    }

    // 往上（往父層元件）找出同時擁有 level 與 level_cap 欄位的資料物件
    function findActorData(fiber){
        let node = fiber;
        for (let i = 0; i < 20 && node; i++) {
            const props = node.memoizedProps;
            if (props && typeof props === "object") {
                for (const key in props) {
                    const val = props[key];
                    if (val && typeof val === "object" &&
                        "level" in val && "level_cap" in val) {
                        return val;
                    }
                }
            }
            const state = node.memoizedState;
            if (state && typeof state === "object") {
                // 有些元件會把資料放在 hook state 裡，簡單掃一層
                let s = state;
                let hops = 0;
                while (s && hops < 6) {
                    if (s.memoizedState && typeof s.memoizedState === "object" &&
                        "level" in s.memoizedState && "level_cap" in s.memoizedState) {
                        return s.memoizedState;
                    }
                    s = s.next;
                    hops++;
                }
            }
            node = node.return;
        }
        return null;
    }

    // 補回上限後文字會變長，容易蓋到旁邊的位置代號 —— 稍微縮小字體讓總寬度不要超出原本範圍
    // 數字越小代表縮得越多，可以自己微調這個比例
    const CAP_FONT_SCALE = 0.7;

    function patchNode(el){
        const text = (el.textContent || "").trim();
        if (ALREADY_HAS_CAP.test(text)) return; // 已經補過了
        if (!ALREADY_LEVEL_ONLY.test(text)) return; // 不是單純數字，可能還沒渲染完成或格式不符，跳過

        const fiber = getFiber(el);
        if (!fiber) return;
        const data = findActorData(fiber);
        if (!data) return;

        const cap = data.level_cap;
        if (cap === undefined || cap === null) return;

        const originalSize = parseFloat(window.getComputedStyle(el).fontSize) || 16;
        if (!el.dataset.uwOrigFontSize) {
            el.dataset.uwOrigFontSize = originalSize; // 記住原本大小，避免重複套用越縮越小
        }
        el.style.fontSize = (parseFloat(el.dataset.uwOrigFontSize) * CAP_FONT_SCALE) + "px";
        el.style.whiteSpace = "nowrap";
        el.textContent = data.level + "/" + cap;
    }

    function scan(root){
        if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
        if (root.querySelectorAll) {
            root.querySelectorAll("div").forEach(el => {
                if (hasTargetClass(el)) patchNode(el);
            });
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "childList") {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (hasTargetClass(node)) patchNode(node);
                    scan(node);
                });
            } else if (m.type === "characterData") {
                const el = m.target.parentElement;
                if (hasTargetClass(el)) patchNode(el);
            }
        }
    });

    function start(){
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
        scan(document);
        console.log("[LVCAP] 上限還原監聽已啟動");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
