// restore_power_display.js - 在角色卡片上補回「戰力」數字覆蓋層
// main.js 恢復成官方原版（不含戰力覆蓋層）之後，靠這支外掛腳本從外部把它加回來
// 做法：找到角色卡片外框(actorBox)，透過 React Fiber 找到該卡片對應的角色資料，
// 讀出 team.power，動態插入一個顯示用的 div（樣式跟原本寫死在 main.js 裡的版本一致）
console.log("[POWER] 啟動外部副程式：戰力顯示還原器已載入");

(function(){
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

    // 往上找同時擁有 level 欄位、且帶 team 或 actor_prototype 欄位的資料物件（也就是原始碼裡的 A）
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

        const power = (data.team && data.team.power !== undefined) ? data.team.power : "0";

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
        console.log("[POWER] 監聽已啟動");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
