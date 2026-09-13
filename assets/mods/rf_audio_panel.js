(() => {
    "use strict";

    const STORAGE_KEY = "rfAudioSettingsV1";
    const PANEL_POSITION_KEY = "rfAudioPanelPositionV1";
    const CATEGORIES = Object.freeze(["effects", "music", "voice"]);
    const LABELS = Object.freeze({
        effects: "效果音",
        music: "背景音樂",
        voice: "角色語音"
    });
    const defaults = Object.freeze({
        effects: { volume: 1, muted: true },
        music: { volume: 1, muted: true },
        voice: { volume: 1, muted: true }
    });

    const trackedMedia = new Set();
    const mediaMetadata = new WeakMap();
    const mediaWithCleanup = new WeakSet();
    const nativePlay = window.HTMLMediaElement && window.HTMLMediaElement.prototype.play;

    function cloneDefaults() {
        return {
            effects: { ...defaults.effects },
            music: { ...defaults.music },
            voice: { ...defaults.voice }
        };
    }

    function clampVolume(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return 1;
        return Math.min(1, Math.max(0, number));
    }

    function normalizeCategory(category) {
        return CATEGORIES.includes(category) ? category : "voice";
    }

    function loadState() {
        const state = cloneDefaults();
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            if (!saved || typeof saved !== "object") return state;
            CATEGORIES.forEach((category) => {
                const item = saved[category];
                if (!item || typeof item !== "object") return;
                state[category].volume = clampVolume(item.volume);
                state[category].muted = Boolean(item.muted);
            });
        } catch (error) {
            console.warn("[RF Audio] 無法讀取音量設定，已使用預設值。", error);
        }
        return state;
    }

    const state = loadState();

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn("[RF Audio] 無法儲存音量設定。", error);
        }
    }

    function normalizeSource(source) {
        if (!source) return "";
        try {
            return decodeURIComponent(new URL(String(source), document.baseURI).pathname).toLowerCase();
        } catch (_) {
            return String(source).toLowerCase();
        }
    }

    function classify(source, media, hint) {
        if (CATEGORIES.includes(hint)) return hint;
        const path = normalizeSource(source || (media && (media.currentSrc || media.src)));
        if (path.includes("/audio/music/")) return "music";
        if (path.includes("/audio/sound_effect/")) return "effects";
        if (media && media.loop) return "music";
        return "voice";
    }

    function effectiveVolume(category) {
        const item = state[normalizeCategory(category)];
        return item.muted ? 0 : clampVolume(item.volume);
    }

    function attachCleanup(media) {
        if (mediaWithCleanup.has(media)) return;
        mediaWithCleanup.add(media);
        const cleanup = () => {
            if (!media.loop) trackedMedia.delete(media);
        };
        media.addEventListener("ended", cleanup);
        media.addEventListener("error", cleanup);
        media.addEventListener("abort", cleanup);
    }

    function prepare(media, source, hint) {
        if (!media || typeof media !== "object") return media;
        const category = classify(source, media, hint);
        mediaMetadata.set(media, { category, source: String(source || media.currentSrc || media.src || "") });
        trackedMedia.add(media);
        attachCleanup(media);
        media.volume = effectiveVolume(category);
        return media;
    }

    function shouldPlay(source, hint) {
        return effectiveVolume(classify(source, null, hint)) > 0;
    }

    function notify() {
        document.dispatchEvent(new CustomEvent("rf-audio-settings-change", {
            detail: getState()
        }));
    }

    function updateTrackedMedia(category, resumeMusic) {
        const normalized = normalizeCategory(category);
        const volume = effectiveVolume(normalized);
        trackedMedia.forEach((media) => {
            if (!media || typeof media.volume !== "number") {
                trackedMedia.delete(media);
                return;
            }
            const metadata = mediaMetadata.get(media);
            const mediaCategory = metadata ? metadata.category : classify(media.currentSrc || media.src, media);
            if (mediaCategory !== normalized) return;
            media.volume = volume;
            if (normalized === "music") {
                if (volume <= 0) {
                    media.pause();
                } else if (resumeMusic && media.paused && (media.currentSrc || media.src)) {
                    const result = nativePlay ? nativePlay.call(media) : media.play();
                    if (result && typeof result.catch === "function") result.catch(() => {});
                }
            }
        });
    }

    function setVolume(category, value) {
        const normalized = normalizeCategory(category);
        state[normalized].volume = clampVolume(value);
        if (state[normalized].volume > 0) state[normalized].muted = false;
        saveState();
        updateTrackedMedia(normalized, true);
        notify();
    }

    function setMuted(category, muted) {
        const normalized = normalizeCategory(category);
        state[normalized].muted = Boolean(muted);
        saveState();
        updateTrackedMedia(normalized, true);
        notify();
    }

    function toggleMuted(category) {
        const normalized = normalizeCategory(category);
        setMuted(normalized, !state[normalized].muted);
    }

    function reset() {
        CATEGORIES.forEach((category) => {
            state[category].volume = defaults[category].volume;
            state[category].muted = defaults[category].muted;
            updateTrackedMedia(category, true);
        });
        saveState();
        notify();
    }

    function getState() {
        return CATEGORIES.reduce((result, category) => {
            result[category] = { ...state[category] };
            return result;
        }, {});
    }

    function installGlobalMediaFallback() {
        if (!nativePlay || window.HTMLMediaElement.prototype.play.__rfAudioWrapped) return;
        const wrappedPlay = function(...args) {
            if (!(window.HTMLAudioElement && this instanceof window.HTMLAudioElement))
                return nativePlay.apply(this, args);
            const metadata = mediaMetadata.get(this);
            prepare(this, this.currentSrc || this.src, metadata && metadata.category);
            if (effectiveVolume((mediaMetadata.get(this) || {}).category) <= 0) {
                this.pause();
                return Promise.resolve();
            }
            return nativePlay.apply(this, args);
        };
        Object.defineProperty(wrappedPlay, "__rfAudioWrapped", { value: true });
        window.HTMLMediaElement.prototype.play = wrappedPlay;
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function injectStyle() {
        if (document.getElementById("rf-audio-panel-style")) return;
        const style = document.createElement("style");
        style.id = "rf-audio-panel-style";
        style.textContent = `
            #rf-audio-panel{
                position:fixed; right:14px; bottom:14px; z-index:2147483646;
                /* 依視窗寬度縮放 */
                width: clamp(140px, 20vw, 260px);
                font-family:ui-monospace,Menlo,Consolas,monospace;
                background:#14160f; color:#e8e4d5; border:1px solid #3a3f2c;
                border-radius:4px; box-shadow:0 4px 18px rgba(0,0,0,.5);
                font-size:clamp(10px, 0.9vw, 13px);
                overflow:hidden;
            }
            #rf-audio-panel .rf-audio-head{
                background:#1c2018; padding:8px 10px; display:flex;
                align-items:center; justify-content:space-between; cursor:move;
                border-bottom:1px solid #3a3f2c;
            }
            #rf-audio-panel .rf-audio-head b{
                color:#d9a441;
                font-weight:600;
                font-size:clamp(10px, 0.85vw, 12px);
            }
            #rf-audio-panel .rf-audio-body{padding:10px;}
            #rf-audio-panel .rf-audio-item{margin-bottom:10px;}
            #rf-audio-panel .rf-audio-item:last-of-type{margin-bottom:8px;}
            #rf-audio-panel .rf-audio-label-row{display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;}
            #rf-audio-panel .rf-audio-label{color:#e8e4d5; font-size:11px;}
            #rf-audio-panel .rf-audio-value{
                font-size:clamp(9px, 0.75vw, 11px);
            }
            #rf-audio-panel .rf-audio-control-row{display:flex; align-items:center; gap:7px;}
            #rf-audio-panel input[type="range"]{flex:1; min-width:0; accent-color:#d9a441; cursor:pointer;}
            #rf-audio-panel button{
                background:#1f2318; color:#e8e4d5; border:1px solid #6a5322;
                font-size:clamp(9px, 0.75vw, 11px);
                padding:clamp(4px, 0.45vw, 6px) clamp(6px, 0.7vw, 8px);
            }
            #rf-audio-panel button:hover{background:#d9a441; color:#161810;}
            #rf-audio-panel button.rf-audio-muted{background:#5b2924; border-color:#9a493f; color:#fff;}
            #rf-audio-panel .rf-audio-footer{display:flex; justify-content:flex-end; border-top:1px solid #303525; padding-top:8px;}
            #rf-audio-panel .rf-audio-min{cursor:pointer; color:#8b9284; font-size:13px; padding:0 2px;}
            #rf-audio-panel .rf-audio-note{color:#8b9284; font-size:9.5px; margin-top:7px; line-height:1.35;}
            //@media (max-width:600px){
                //#rf-audio-panel{width:min(260px,calc(100vw - 28px)); bottom:14px;}
            //}
        `;
        document.head.appendChild(style);
    }

    function restorePanelPosition(panel) {
        try {
            const saved = JSON.parse(localStorage.getItem(PANEL_POSITION_KEY) || "null");
            if (!saved || !Number.isFinite(saved.left) || !Number.isFinite(saved.top)) return;
            const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
            panel.style.left = `${Math.min(maxLeft, Math.max(0, saved.left))}px`;
            panel.style.top = `${Math.min(maxTop, Math.max(0, saved.top))}px`;
            panel.style.right = "auto";
            panel.style.bottom = "auto";
        } catch (_) {}
    }

    function savePanelPosition(panel) {
        try {
            const rect = panel.getBoundingClientRect();
            localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
        } catch (_) {}
    }

    function enableDrag(panel, handle) {
        let drag = null;
        handle.addEventListener("pointerdown", (event) => {
            if (event.target.closest(".rf-audio-min")) return;
            const rect = panel.getBoundingClientRect();
            drag = { pointerId: event.pointerId, x: event.clientX - rect.left, y: event.clientY - rect.top };
            handle.setPointerCapture(event.pointerId);
            event.preventDefault();
        });
        handle.addEventListener("pointermove", (event) => {
            if (!drag || drag.pointerId !== event.pointerId) return;
            const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
            const left = Math.min(maxLeft, Math.max(0, event.clientX - drag.x));
            const top = Math.min(maxTop, Math.max(0, event.clientY - drag.y));
            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
            panel.style.right = "auto";
            panel.style.bottom = "auto";
        });
        const finish = (event) => {
            if (!drag || drag.pointerId !== event.pointerId) return;
            drag = null;
            savePanelPosition(panel);
        };
        handle.addEventListener("pointerup", finish);
        handle.addEventListener("pointercancel", finish);
    }

    function buildPanel() {
        if (document.getElementById("rf-audio-panel")) return;
        injectStyle();

        const panel = makeElement("section");
        panel.id = "rf-audio-panel";
        panel.setAttribute("aria-label", "RF 音量控制");

        const head = makeElement("div", "rf-audio-head");
        head.appendChild(makeElement("b", "", "[RF] 音量控制面板"));
        const minButton = makeElement("span", "rf-audio-min", "—");
        minButton.setAttribute("role", "button");
        minButton.setAttribute("tabindex", "0");
        minButton.setAttribute("aria-label", "收合音量控制");
        head.appendChild(minButton);
        panel.appendChild(head);

        const body = makeElement("div", "rf-audio-body");
        const controls = new Map();

        CATEGORIES.forEach((category) => {
            const item = makeElement("div", "rf-audio-item");
            const labelRow = makeElement("div", "rf-audio-label-row");
            labelRow.appendChild(makeElement("span", "rf-audio-label", LABELS[category]));
            const value = makeElement("span", "rf-audio-value");
            labelRow.appendChild(value);
            item.appendChild(labelRow);

            const controlRow = makeElement("div", "rf-audio-control-row");
            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "100";
            slider.step = "1";
            slider.setAttribute("aria-label", `${LABELS[category]}音量`);
            const mute = makeElement("button");
            mute.type = "button";
            controlRow.appendChild(slider);
            controlRow.appendChild(mute);
            item.appendChild(controlRow);
            body.appendChild(item);

            slider.addEventListener("input", () => setVolume(category, Number(slider.value) / 100));
            mute.addEventListener("click", () => toggleMuted(category));
            controls.set(category, { slider, value, mute });
        });

        const footer = makeElement("div", "rf-audio-footer");
        const resetButton = makeElement("button", "", "重設為 100%");
        resetButton.type = "button";
        resetButton.addEventListener("click", reset);
        footer.appendChild(resetButton);
        body.appendChild(footer);
        body.appendChild(makeElement("div", "rf-audio-note", "設定會保存在此瀏覽器；音量 0% 時不載入該類音訊。"));
        panel.appendChild(body);
        document.body.appendChild(panel);

        // ---- 精準疊在側錄面板上方 ----
        function stackAboveUwPanel() {
            const uw = document.getElementById('uw-panel');
            if (!uw) return; // 側錄面板不存在就維持原本位置

            const gap = 8; // 兩個面板之間的間距(px)
            const uwRect = uw.getBoundingClientRect();

            panel.style.right = (window.innerWidth - uwRect.right) + 'px';
            panel.style.bottom = (window.innerHeight - uwRect.top + gap) + 'px';

            // 使用 bottom/right 定位時，清除 left/top
            panel.style.left = 'auto';
            panel.style.top = 'auto';
        }

        // 初次定位
        stackAboveUwPanel();

        // 視窗大小改變時重新對齊
        window.addEventListener('resize', stackAboveUwPanel);
        // 側錄面板拖曳後重新對齊
        document.addEventListener('uw-panel-moved', stackAboveUwPanel);

        function render() {
            CATEGORIES.forEach((category) => {
                const control = controls.get(category);
                const item = state[category];
                const percent = Math.round(item.volume * 100);
                control.slider.value = String(percent);
                control.value.textContent = item.muted ? `靜音 (${percent}%)` : `${percent}%`;
                control.mute.textContent = item.muted ? "取消靜音" : "靜音";
                control.mute.classList.toggle("rf-audio-muted", item.muted);
            });
        }

        let collapsed = true;
        body.style.display = "none";
        minButton.textContent = "+";
        minButton.setAttribute("aria-label", "展開音量控制");
        const toggleCollapsed = () => {
            collapsed = !collapsed;
            body.style.display = collapsed ? "none" : "block";
            minButton.textContent = collapsed ? "+" : "—";
            minButton.setAttribute("aria-label", collapsed ? "展開音量控制" : "收合音量控制");
        };
        minButton.addEventListener("click", toggleCollapsed);
        minButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCollapsed();
            }
        });

        document.addEventListener("rf-audio-settings-change", render);
        enableDrag(panel, head);
        //restorePanelPosition(panel);
        render();
    }

    const api = Object.freeze({
        classify,
        prepare,
        shouldPlay,
        effectiveVolume,
        getState,
        setVolume,
        setMuted,
        toggleMuted,
        reset
    });

    window.RFAudio = api;
    installGlobalMediaFallback();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildPanel, { once: true });
    } else {
        buildPanel();
    }

    console.log("[RF Audio] 三類音量控制已載入。", getState());
})();
