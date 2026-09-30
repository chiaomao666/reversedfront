// formation_rune_display.js - 編隊角色符文（武器）純顯示
// 只讀取 React card / store 中既有資料並加上 DOM 標籤；不送出請求、不改寫遊戲狀態。
(function () {
    "use strict";

    if (window.__uwFormationRuneDisplay) return;
    window.__uwFormationRuneDisplay = true;

    const ACTOR_BOX_PREFIX = "Actorcard_actorBox__";
    const MARKER = "uwFormationRune";

    function isFormationPage() {
        const path = String(location.pathname || "");
        const hash = String(location.hash || "");
        return (
            path.indexOf("/user/teams/") === 0 ||
            path.indexOf("/user/pickactors/") === 0 ||
            path.indexOf("/user/actors") === 0 ||
            hash.indexOf("/user/teams/") >= 0 ||
            hash.indexOf("/user/pickactors/") >= 0 ||
            hash.indexOf("/user/actors") >= 0
        );
    }

    function isPickActorsPage() {
        const path = String(location.pathname || "");
        const hash = String(location.hash || "");
        return (
            path.indexOf("/user/pickactors/") === 0 ||
            path.indexOf("/user/actors") === 0 ||
            hash.indexOf("/user/pickactors/") >= 0 ||
            hash.indexOf("/user/actors") >= 0
        );
    }

    function isActorBox(node) {
        return Boolean(
            node &&
            typeof node.className === "string" &&
            node.className.split(/\s+/).some(function (name) {
                return name.indexOf(ACTOR_BOX_PREFIX) === 0;
            })
        );
    }

    function getFiber(node) {
        const key = Object.keys(node).find(function (name) {
            return name.indexOf("__reactFiber$") === 0 || name.indexOf("__reactInternalInstance$") === 0;
        });
        return key ? node[key] : null;
    }

    function findActor(fiber) {
        let node = fiber;
        for (let hop = 0; hop < 24 && node; hop += 1, node = node.return) {
            const props = node.memoizedProps;
            if (!props || typeof props !== "object") continue;
            for (const key in props) {
                const value = props[key];
                if (
                    value &&
                    typeof value === "object" &&
                    "level" in value &&
                    ("actor_prototype" in value || "team" in value)
                ) {
                    return value;
                }
            }
        }
        return null;
    }

    function getWeaponPrototype(actor) {
        const weapon = actor && actor.weapon;
        if (weapon && weapon.weapon_prototype) return weapon.weapon_prototype;

        const prototypeId = weapon && weapon.weapon_prototype_id;
        if (!prototypeId || !window.RFStore || typeof window.RFStore.get !== "function") return null;

        const store = window.RFStore.get();
        const prototypes = store && store.weapon_prototypes;
        return Array.isArray(prototypes)
            ? prototypes.find(function (item) { return item && item.id === prototypeId; }) || null
            : null;
    }

    function getRuneDisplay(actor) {
        const weapon = actor && actor.weapon;
        if (!weapon) return { name: "未配戴", image: "" };

        const prototype = getWeaponPrototype(actor);
        return {
            name: prototype && prototype.name || weapon.name || "已配戴",
            image: prototype && prototype.image || weapon.image || ""
        };
    }

    // 遊戲資料中的圖片通常是 /images/weapon/...；主程式會把它解析到
    // ./passionfruit/images/...。本模組的原生 img 也必須做相同轉換。
    function resolveImageSource(path) {
        if (!path || typeof path !== "string") return "";
        if (
            path.indexOf("data:") === 0 ||
            path.indexOf("http://") === 0 ||
            path.indexOf("https://") === 0 ||
            path.indexOf("/static/") === 0 ||
            path.indexOf("./static/") === 0
        ) {
            return path;
        }

        const downloadedAssets = window.deviceInfo && window.deviceInfo.assetsDL_path;
        if (downloadedAssets) return downloadedAssets + path;

        return "./passionfruit" + (path.charAt(0) === "/" ? path : "/" + path);
    }

    function renderCard(card) {
        const actor = findActor(getFiber(card));
        if (!actor) return;

        let badge = card.querySelector(":scope > [data-uw-formation-rune]");
        if (!badge) {
            badge = document.createElement("div");
            badge.dataset.uwFormationRune = "1";
            badge.className = "uw-formation-rune";
            badge.setAttribute("aria-live", "polite");
            card.appendChild(badge);
        }
        badge.classList.toggle("uw-formation-rune--picker", isPickActorsPage());

        const rune = getRuneDisplay(actor);
        let icon = badge.querySelector(":scope > img");
        let name = badge.querySelector(":scope > span");

        if (rune.image) {
            if (!icon) {
                icon = document.createElement("img");
                icon.className = "uw-formation-rune-icon";
                icon.alt = "";
                icon.decoding = "async";
                badge.prepend(icon);
            }
            const source = resolveImageSource(rune.image);
            if (icon.src !== new URL(source, location.href).href) icon.src = source;
        } else if (icon) {
            icon.remove();
        }

        if (!name) {
            name = document.createElement("span");
            name.className = "uw-formation-rune-name";
            badge.appendChild(name);
        }
        if (name.textContent !== rune.name) name.textContent = rune.name;
        badge.title = rune.name;
    }

    function removeBadges(root) {
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll("[data-uw-formation-rune]").forEach(function (node) {
            node.remove();
        });
    }

    function scan(root) {
        if (!isFormationPage()) {
            removeBadges(document);
            return;
        }

        if (isActorBox(root)) renderCard(root);
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll("div").forEach(function (node) {
            if (isActorBox(node)) renderCard(node);
        });
    }

    function start() {
        scan(document);

        if (window.UWSched && typeof window.UWSched.register === "function") {
            window.UWSched.register({
                id: "formation_rune_display",
                onNodes: function (nodes) {
                    nodes.forEach(scan);
                },
                onFrame: function () {
                    if (!isFormationPage()) removeBadges(document);
                }
            });
            console.log("[FORMATION RUNE] 已啟用共用排程器");
            return;
        }

        // 核心排程器不存在時才使用本地 fallback，保持獨立可用。
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) scan(node);
                });
            });
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.warn("[FORMATION RUNE] 找不到 UWSched，改用獨立 observer");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
