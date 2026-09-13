// pvp_opponent_persist.js - PVP 戰鬥開始時雙方名字/組織只顯示幾秒，容易來不及看
// 做法：偵測到開門動畫裡的文字出現時，把文字內容抓出來，
// 用一個簡單的小面板固定顯示在畫面上方，直到這場戰鬥畫面關閉才移除
console.log("[PVPINFO] 啟動外部副程式：對手資訊常駐顯示已載入");

(function(){
    const ROOT_PREFIX = "PvpBattle_rootContainer";
    // Title1 = 玩家名稱（大字）、Title2 = 組織名稱（小字），左邊自己/右邊對手
    const LEFT_TITLE1_PREFIX = "AniDoor_leftTitle1_";   // 自己：玩家名稱
    const LEFT_TITLE2_PREFIX = "AniDoor_leftTitle2_";   // 自己：組織名稱
    const RIGHT_TITLE1_PREFIX = "AniDoor_rightTitle1_"; // 對手：玩家名稱
    const RIGHT_TITLE2_PREFIX = "AniDoor_rightTitle2_"; // 對手：組織名稱
    const PERSIST_ID = "uw-pvp-name-persist";

    let persistedEl = null;
    let lastKey = "";

    function hasPrefix(el, prefix){
        return el && el.className && typeof el.className === "string" &&
               el.className.split(/\s+/).some(c => c.indexOf(prefix) === 0);
    }

    function findText(root, prefix){
        if (!root || !root.querySelectorAll) return "";
        const el = Array.from(root.querySelectorAll("div")).find(d => hasPrefix(d, prefix));
        return el ? el.textContent.trim() : "";
    }

    function removePersisted(){
        if (persistedEl) {
            persistedEl.remove();
            persistedEl = null;
        }
        lastKey = "";
    }

    function makeColumn(orgText, nameText, align){
        const col = document.createElement("div");
        Object.assign(col.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: align === "right" ? "flex-end" : "flex-start",
            lineHeight: "1.25"
        });
        const org = document.createElement("div");
        org.textContent = orgText || "";
        Object.assign(org.style, { fontSize: "11px", opacity: "0.75", fontWeight: "normal" });
        const name = document.createElement("div");
        name.textContent = nameText || "?";
        Object.assign(name.style, { fontSize: "17px", fontWeight: "bold" });
        col.appendChild(org);
        col.appendChild(name);
        return col;
    }

    function ensurePanel(){
        if (persistedEl) return persistedEl;
        const box = document.createElement("div");
        box.id = PERSIST_ID;
        Object.assign(box.style, {
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "999999",
            pointerEvents: "none",
            padding: "8px 20px",
            background: "rgba(0,0,0,0.55)",
            borderRadius: "6px",
            color: "#fff",
            fontFamily: "sans-serif",
            textShadow: "0 0 4px #000",
            display: "flex",
            gap: "18px",
            alignItems: "center"
        });
        document.body.appendChild(box);
        persistedEl = box;
        return box;
    }

    function renderNames(leftOrg, leftName, rightOrg, rightName){
        if (!leftName && !rightName) return;
        const key = [leftOrg, leftName, rightOrg, rightName].join("|");
        if (key === lastKey) return; // 沒變化，不用重畫
        lastKey = key;

        const box = ensurePanel();
        box.textContent = "";

        const leftCol = makeColumn(leftOrg, leftName, "left");
        const vs = document.createElement("span");
        vs.textContent = "VS";
        vs.style.opacity = "0.6";
        vs.style.fontSize = "12px";
        const rightCol = makeColumn(rightOrg, rightName, "right");
        rightCol.style.color = "#ffb3b3";

        box.appendChild(leftCol);
        box.appendChild(vs);
        box.appendChild(rightCol);
    }

    function tryCapture(root){
        const leftName = findText(root, LEFT_TITLE1_PREFIX);
        const leftOrg = findText(root, LEFT_TITLE2_PREFIX);
        const rightName = findText(root, RIGHT_TITLE1_PREFIX);
        const rightOrg = findText(root, RIGHT_TITLE2_PREFIX);
        if (leftName || rightName) {
            renderNames(leftOrg, leftName, rightOrg, rightName);
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (hasPrefix(node, ROOT_PREFIX)) {
                    removePersisted(); // 新一場戰鬥開始，先清掉上一場殘留的
                }
                // 文字渲染需要一點時間，稍微等一下再抓
                setTimeout(() => tryCapture(document), 300);
            });
            m.removedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (hasPrefix(node, ROOT_PREFIX)) {
                    removePersisted(); // 戰鬥畫面關閉，收掉常駐顯示
                }
            });
        }
    });

    function start(){
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.log("[PVPINFO] 監聽已啟動");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
