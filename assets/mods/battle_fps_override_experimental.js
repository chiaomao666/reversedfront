/*
 * RF battle FPS override（實驗版）
 *
 * 重要：此檔案預設不啟用，且不應與穩定版 battle_anim_speed.js 同時啟用。
 * 它不攔截 setInterval / setTimeout / requestAnimationFrame，也不修改全域時間。
 *
 * 原理：若頁面把 React 暴露為 window.React，且 spritesheet 元件透過
 * React.createElement 傳入數字 fps prop，本檔案可在建立元件時改寫 fps。
 * 正式 bundle 通常把 React 放在模組閉包內，因此不一定能捕捉到；這是預期限制。
 */
(function () {
    "use strict";

    if (window.__rfBattleFPSOverrideLoaded) return;
    window.__rfBattleFPSOverrideLoaded = true;

    var state = {
        enabled: false,
        multiplier: 1,
        patched: false,
        candidates: 0,
        changed: 0,
        originalCreateElement: null
    };

    function isValidMultiplier(value) {
        return value === 0.5 || value === 1 || value === 2 || value === 4 || value === 8;
    }

    function looksLikeSpriteProps(props) {
        if (!props || typeof props !== "object") return false;
        if (typeof props.fps !== "number" || !isFinite(props.fps) || props.fps <= 0) return false;
        // 只接受看起來像動畫元件的 props，避免修改一般 React 元件。
        return props.loop === true || typeof props.onLoopComplete === "function" ||
            typeof props.onComplete === "function" || typeof props.direction === "string";
    }

    function patchReact() {
        var react = window.React;
        if (!react || typeof react.createElement !== "function") return false;
        if (state.patched) return true;

        state.originalCreateElement = react.createElement;
        react.createElement = function (type, props) {
            if (state.enabled && looksLikeSpriteProps(props)) {
                state.candidates += 1;
                var nextProps = Object.assign({}, props);
                nextProps.fps = Math.max(1, Math.ceil(props.fps * state.multiplier));
                state.changed += 1;
                return state.originalCreateElement.apply(this, [type, nextProps].concat([].slice.call(arguments, 2)));
            }
            return state.originalCreateElement.apply(this, arguments);
        };
        state.patched = true;
        console.warn("[BattleFPSExperimental] 已掛上 React.createElement FPS 實驗攔截；只會在啟用後修改符合動畫特徵的 fps props。", state);
        return true;
    }

    function restore() {
        var react = window.React;
        if (state.patched && react && state.originalCreateElement) {
            react.createElement = state.originalCreateElement;
        }
        state.patched = false;
        state.originalCreateElement = null;
    }

    window.RFBattleFPSOverride = {
        version: "0.1-experimental",
        enable: function (multiplier) {
            if (!isValidMultiplier(multiplier)) {
                throw new Error("倍率只允許 0.5、1、2、4 或 8");
            }
            state.multiplier = multiplier;
            state.enabled = true;
            patchReact();
            console.warn("[BattleFPSExperimental] 已啟用倍率 " + multiplier + "×。若 patched=false，代表 React 未暴露於 window，實驗功能不會生效。", this.status());
            return this.status();
        },
        disable: function () {
            state.enabled = false;
            restore();
            return this.status();
        },
        status: function () {
            return {
                enabled: state.enabled,
                multiplier: state.multiplier,
                patched: state.patched,
                candidates: state.candidates,
                changed: state.changed
            };
        }
    };

    // 只做診斷，不自動修改任何動畫。
    console.warn("[BattleFPSExperimental] 已載入但預設關閉。使用 window.RFBattleFPSOverride.enable(4) 才會嘗試攔截 fps。");
})();
