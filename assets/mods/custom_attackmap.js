/**
 * 我的專屬系統注入腳本 - v4.9 中線放大版
 *
 * 遊戲（React）節點只讀取文字並以 visibility 隱藏；分數、攻守與倒數皆由本外掛
 * 自己的固定尺寸節點顯示，因此不會移動、包裝或刪除任何遊戲管理的子節點。
 */
(function () {
    "use strict";

    if (window.__customAttackMapModV49) return;
    window.__customAttackMapModV49 = true;

    const SELECTORS = {
        scoreAndTime: 'div[class*="nation_battle_close_roll_call_at"]',
        flag: 'div[class*="Attackmap_flagLeft__P-F-D"], img[class*="Attackmap_flag__91wA5"]'
    };
    const STYLE_ID = 'rf-custom-attackmap-style-v49';
    const FRAME_ID = 'rf-attackmap-status-frame-v49';
    const FLAG_VERTICAL_RATIO = 0.50;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            div[class*="Attackmap_markerCityName__"] { display: block !important; visibility: visible !important; opacity: 1 !important; }
            div[class*="Attackmap_markerCityIcon__"] img:not([src*="/control/"]) { display: none !important; }

            /* 僅由外掛管理的戰況資訊框；尺寸刻意貼近原介面的細小矩形。 */
            #${FRAME_ID} {
                box-sizing: border-box;
                position: fixed;
                display: none;
                align-items: center;
                justify-content: center;
                height: 22px;
                min-width: 82px;
                padding: 0 7px;
                border: 1px solid rgba(204, 220, 232, .74);
                border-radius: 1px;
                background: rgba(10, 25, 39, .88);
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .72);
                color: #f5f8fb;
                font-family: var(--font_text_figures, sans-serif);
                font-size: 15px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
                line-height: 1;
                letter-spacing: 0;
                pointer-events: none;
                white-space: nowrap;
                z-index: 10000;
                transform: translate(-50%, -50%);
            }
            #${FRAME_ID}.rf-status-score { min-width: 78px; gap: 3px; }
            #${FRAME_ID}.rf-status-countdown { min-width: 86px; }
            #${FRAME_ID} .rf-status-side {
                font: inherit;
                font-size: 14px;
                font-weight: 700;
            }
            #${FRAME_ID} .rf-status-attack { color: #ff5c5c; }
            #${FRAME_ID} .rf-status-defend { color: #65baff; }
            #${FRAME_ID} .rf-status-value { color: #f5f8fb; }
        `;
        document.head.appendChild(style);
    }

    function isMapPage() {
        const hash = window.location.hash;
        return hash.includes('attacks') || hash.includes('attackmap') || hash.includes('nationbattle');
    }

    function getStatusText(scoreEl) {
        return (scoreEl.textContent || '').replace(/攻|守/g, '').trim();
    }

    function isCountdownText(text) {
        return /(\d{1,2}:){1,2}\d{2}/.test(text) && text.length >= 5;
    }

    function createSpan(className, text) {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        return span;
    }

    function getFrame() {
        let frame = document.getElementById(FRAME_ID);
        if (!frame && document.body) {
            frame = document.createElement('div');
            frame.id = FRAME_ID;
            frame.setAttribute('aria-hidden', 'true');
            document.body.appendChild(frame);
        }
        return frame;
    }

    function hideFrame() {
        const frame = document.getElementById(FRAME_ID);
        if (frame) frame.style.display = 'none';
    }

    function renderFrame(frame, text, isCountdown) {
        const mode = isCountdown ? 'countdown' : 'score';
        if (frame.dataset.mode === mode && frame.dataset.value === text) return;

        frame.className = `rf-attackmap-status-frame rf-status-${mode}`;
        frame.dataset.mode = mode;
        frame.dataset.value = text;
        frame.replaceChildren();

        if (isCountdown) {
            frame.appendChild(createSpan('rf-status-value', text));
            return;
        }

        frame.appendChild(createSpan('rf-status-side rf-status-attack', '攻'));
        frame.appendChild(createSpan('rf-status-value', text));
        frame.appendChild(createSpan('rf-status-side rf-status-defend', '守'));
    }

    function clearGamePositionOverride(scoreEl) {
        [
            'position', 'left', 'top', 'transform', 'z-index', 'pointer-events',
            'white-space', 'margin', 'padding', 'background', 'display',
            'align-items', 'justify-content'
        ].forEach((property) => scoreEl.style.removeProperty(property));
    }

    function syncFrame(scoreEl) {
        const flag = document.querySelector(SELECTORS.flag);
        const frame = getFrame();
        if (!flag || !frame) return;

        const rect = flag.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const text = getStatusText(scoreEl);
        const countdown = isCountdownText(text);
        renderFrame(frame, text, countdown);

        frame.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
        frame.style.top = `${Math.round(rect.top + rect.height * FLAG_VERTICAL_RATIO)}px`;
        frame.style.display = 'flex';
    }

    function update() {
        if (!isMapPage()) {
            hideFrame();
            return;
        }

        const scoreEl = document.querySelector(SELECTORS.scoreAndTime);
        if (!scoreEl) {
            hideFrame();
            return;
        }

        clearGamePositionOverride(scoreEl);
        scoreEl.style.visibility = 'hidden';
        syncFrame(scoreEl);
    }

    injectStyle();
    setInterval(update, 50);
    console.log('[Custom AttackMap] v4.9 中線放大版啟動（旗幟 50%／加大資訊框）');
})();
