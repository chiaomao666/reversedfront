/**
 * 據點戰動畫跳過／流程快轉 mod
 *
 * 作用：把戰鬥畫面中「三個區域完成後等待 2000ms」與
 *      「第一區域結束後等待 2000ms」縮短到 SKIP_MS。
 *
 * 注意：這不會改寫 WebSocket、傷害、比分或伺服器回合；
 *      它只跳過主程式在視覺流程之間的固定停留。
 *      角色攻擊本身的逐幀動畫仍會由原程式播放，避免 React 狀態不同步。
 */
(function () {
    "use strict";

    var SKIP_MS = 16;
    var TARGET_DELAY = 2000;

    if (window.__battleSkipAnimMod) return;
    window.__battleSkipAnimMod = true;

    console.log(
        "%c[BattleSkipAnim] 戰鬥視覺流程快轉已啟用：2000ms -> " + SKIP_MS + "ms",
        "color:#0a0;font-weight:bold"
    );

    var originalSetTimeout = window.setTimeout;

    function isBattleTransitionCallback(callback) {
        if (typeof callback !== "function") return false;

        var source;
        try {
            source = Function.prototype.toString.call(callback);
        } catch (e) {
            return false;
        }

        // 回合全部完成後，主程式呼叫 roundEnd_callback。
        if (source.indexOf("roundEnd_callback") !== -1) return true;

        // 第一個區域完成後，主程式以 e + 1 推進 zone index。
        if (/return\s+[et]\s*\+\s*1/.test(source)) return true;

        return false;
    }

    window.setTimeout = function (callback, delay) {
        var args = Array.prototype.slice.call(arguments);

        if (
            delay === TARGET_DELAY &&
            isBattleTransitionCallback(callback)
        ) {
            args[1] = SKIP_MS;
            console.log(
                "[BattleSkipAnim] 跳過戰鬥固定停留：" +
                TARGET_DELAY + "ms -> " + SKIP_MS + "ms"
            );
        }

        return originalSetTimeout.apply(window, args);
    };
})();
