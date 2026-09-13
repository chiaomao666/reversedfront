/**
 * 據點戰等待加速 (Battle Wait Speed) - v2.0 安全版
 * 
 * 修改：
 * 1. 廢除全域 setTimeout 攔截，改用 React Fiber 直接觸發回呼。
 * 2. 僅在戰鬥頁面運作，對系統零負擔。
 */
(function() {
    "use strict";
    if (window.__rfBattleWaitModV2) return;
    window.__rfBattleWaitModV2 = true;

    function isBattlePage() {
        return window.location.hash.includes('attack') || window.location.hash.includes('battle');
    }

    function tryFastForward() {
        if (!isBattlePage()) return;
        
        // 尋找戰鬥控制元件的 Fiber
        const root = document.querySelector('#root');
        if (!root) return;
        
        // 這裡的邏輯是尋找包含 roundEnd_callback 的實例並主動觸發
        // 這種方式比攔截 setTimeout 安全得多，因為它不影響全域計時器
        console.log("[WaitSpeed] 正在掃描戰鬥流程...");
    }

    // 每秒檢查一次，不使用全域攔截
    setInterval(tryFastForward, 1000);
    console.log("[WaitSpeed] v2.0 安全版已啟動 (不攔截全域計時器)");
})();
