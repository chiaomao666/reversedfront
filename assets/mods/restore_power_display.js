// restore_power_display.js - 原始穩定還原版
(function(){
    "use strict";
    const CLASS_PREFIX = "Actorcard_actorBox__";
    const MARK_ATTR = "uwPowerOverlay";

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

    function findActorData(fiber){
        let node = fiber;
        for (let i = 0; i < 20 && node; i++) {
            const props = node.memoizedProps;
            if (props && typeof props === "object") {
                for (const key in props) {
                    const val = props[key];
                    if (val && typeof val === "object" && "level" in val &&
                        ("team" in val || "actor_prototype" in val)) {
                        return val;
                    }
                }
            }
            node = node.return;
        }
        return null;
    }

    function ensureOverlay(actorBoxEl){
        const fiber = getFiber(actorBoxEl);
        if (!fiber) return;
        const data = findActorData(fiber);
        if (!data) return;

        const power = (data.team && data.team.power !== undefined) ? data.team.power : (data.power || "0");

        let overlay = actorBoxEl.querySelector(":scope > [data-" + MARK_ATTR.replace(/([A-Z])/g, "-$1").toLowerCase() + "]");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.dataset[MARK_ATTR] = "1";
            Object.assign(overlay.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "20px",
                textShadow: "0 0 6px #000",
                pointerEvents: "none",
                zIndex: "999"
            });
            actorBoxEl.appendChild(overlay);
        }
        overlay.textContent = power;
    }

    function scan(root){
        if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
        if (root.querySelectorAll) {
            root.querySelectorAll("div").forEach(el => {
                if (hasTargetClass(el)) ensureOverlay(el);
            });
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "childList") {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (hasTargetClass(node)) ensureOverlay(node);
                    scan(node);
                });
            }
        }
    });

    function start(){
        observer.observe(document.documentElement, { childList: true, subtree: true });
        scan(document);
        console.log("[POWER] 原始穩定版已還原");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
