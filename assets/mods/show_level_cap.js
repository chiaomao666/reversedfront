// show_level_cap.js - 顯示角色等級上限，不改寫遊戲原本的等級文字。
// 原生等級元件由 FitText 負責排版；直接塞入「N/上限」會破壞它的尺寸計算。
console.log("[LVCAP] 啟動外部副程式：等級上限標籤已載入");

(function () {
    const LEVEL_CLASS_PREFIXES = ["Actorcard_actorLv_", "Actors_actorLv_"];
    const CARD_CLASS_PREFIXES = ["Actorcard_actorBox_", "Actors_actorBox_"];
    const LEGACY_CAP_TEXT = /^\d+\s*\/\s*\d+$/;
    const LEVEL_TEXT = /^\d+$/;
    const BADGE_SELECTOR = "[data-uw-level-cap]";

    function hasClassPrefix(el, prefix) {
        return el && typeof el.className === "string" &&
            el.className.split(/\s+/).some(name => name.indexOf(prefix) === 0);
    }

    function hasAnyClassPrefix(el, prefixes) {
        return prefixes.some(prefix => hasClassPrefix(el, prefix));
    }

    function usesCompactCardLayout() {
        const route = (location.pathname + location.hash).toLowerCase();
        return route.includes("/user/pickactors") || route.includes("/user/actors");
    }

    function getFiber(el) {
        const key = Object.keys(el).find(key =>
            key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
        );
        return key ? el[key] : null;
    }

    function findActorData(fiber) {
        let node = fiber;
        for (let i = 0; i < 20 && node; i += 1) {
            const props = node.memoizedProps;
            if (props && typeof props === "object") {
                for (const key in props) {
                    const value = props[key];
                    if (value && typeof value === "object" &&
                        "level" in value && "level_cap" in value) return value;
                }
            }
            let hook = node.memoizedState;
            for (let hops = 0; hook && hops < 6; hops += 1, hook = hook.next) {
                const value = hook.memoizedState;
                if (value && typeof value === "object" &&
                    "level" in value && "level_cap" in value) return value;
            }
            node = node.return;
        }
        return null;
    }

    function findCard(el) {
        let node = el;
        while (node && node !== document.body) {
            if (hasAnyClassPrefix(node, CARD_CLASS_PREFIXES)) return node;
            node = node.parentElement;
        }
        return null;
    }

    function restoreLegacyLevel(el, level) {
        // 舊版模組曾把原生文字直接改成 N/上限；讓更新後可立即復原。
        if (LEGACY_CAP_TEXT.test((el.textContent || "").trim())) el.textContent = String(level);
        if (el.dataset.uwOrigFontSize) {
            el.style.fontSize = "";
            el.style.whiteSpace = "";
            delete el.dataset.uwOrigFontSize;
        }
    }

    function ensureBadge(card, data) {
        let badge = card.querySelector(BADGE_SELECTOR);
        if (!badge) {
            badge = document.createElement("div");
            badge.dataset.uwLevelCap = "";
            badge.className = "uw-level-cap";
            badge.setAttribute("aria-label", "角色等級上限");
        }
        // 使用角色框比例定位，避免 FitText 與各頁面版型造成位置跳動。
        if (badge.parentElement !== card) card.appendChild(badge);
        badge.style.right = "";
        badge.style.bottom = "";
        badge.classList.toggle("uw-level-cap--compact", usesCompactCardLayout());
        badge.textContent = "上限 " + data.level_cap;
        badge.title = "等級 " + data.level + " / " + data.level_cap;
    }

    function patchNode(el) {
        if (!hasAnyClassPrefix(el, LEVEL_CLASS_PREFIXES)) return;
        const data = findActorData(getFiber(el));
        if (!data || data.level == null || data.level_cap == null) return;
        restoreLegacyLevel(el, data.level);
        if (!LEVEL_TEXT.test((el.textContent || "").trim())) return;
        const card = findCard(el);
        if (card) ensureBadge(card, data);
    }

    function scan(root) {
        if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
        if (hasAnyClassPrefix(root, LEVEL_CLASS_PREFIXES)) patchNode(root);
        root.querySelectorAll?.("div").forEach(patchNode);
    }

    function installStyle() {
        if (document.getElementById("uw-level-cap-style")) return;
        const style = document.createElement("style");
        style.id = "uw-level-cap-style";
        style.textContent = `
            .uw-level-cap {
                position: absolute; right: 0; bottom: 5%; z-index: 6;
                box-sizing: border-box; padding: .14em .45em;
                border: 1px solid rgba(229, 187, 58, .88); border-radius: .25em;
                background: rgba(8, 8, 8, .72); color: #ffe899;
                font-family: var(--font_noto_sans, sans-serif);
                font-size: clamp(10px, .85vw, 14px); font-weight: 700; line-height: 1.25;
                text-align: center; text-shadow: 0 1px 2px #000; white-space: nowrap;
                pointer-events: none;
            }
            .uw-level-cap.uw-level-cap--compact { bottom: 11%; }
        `;
        document.head.appendChild(style);
    }

    function start() {
        installStyle();
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") patchNode(mutation.target.parentElement);
                else mutation.addedNodes.forEach(scan);
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
        scan(document);
        console.log("[LVCAP] 上限標籤監聽已啟動");
    }

    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", start)
        : start();
})();
