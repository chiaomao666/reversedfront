// actorpool_record_filter.js - 抽卡紀錄搜尋 / 篩選 / 抽數標籤
// 背景：main.js（Actorpoolsrecord 頁面，也就是 aI/rI/.../vI/yI/_I 那組元件）目前是用
// 「一箱一箱」的卡片格線呈現抽卡紀錄，沒有搜尋欄，也看不到十抽格線裡每一張的角色名稱。
// 我們沒辦法直接改 main.js 原始碼，所以做法是：
//   1. 偵測 Actorpoolsrecord 的內容區塊（Actorpoolsrecord_contentOutBox__ 開頭的 class）出現在畫面上
//   2. 從該元素往上找 React Fiber，找到握有 used_recruit_coupons 原始資料的 DCContext Provider
//   3. 自己重新計算「第幾抽 / 單抽 or 十抽 / 是否為該角色最新一次抽到」
//   4. 把原本的格線畫面隱藏，改成我們自己畫的清單 + 搜尋欄 + SSR/SR/R 篩選
// DOM 上使用的 class 名稱（custom-record-row / custom-record-name / custom-record-date /
// custom-record-index / custom-record-new / custom-record-pulltype / custom-search-container /
// custom-checkbox-group / custom-checkbox-label / custom-search-input / rarity-ssr / rarity-sr /
// rarity-r）刻意跟外部樣式模組 actorpool_record_filter.css 對齊，顏色、字體、面板位置全部交給
// 那份 CSS 決定；這支 JS 只補 CSS 沒管到的排版骨架（列的 flex 排列、分隔線）。
console.log("[APRFILTER] 啟動外部副程式：抽卡紀錄搜尋/篩選面板已載入");

(function () {
    // Actorpoolsrecord 內容區塊的 class（webpack CSS module 的雜湊後綴每次改版都可能不同，
    // 所以只比對到 "__" 前面這段固定字首，跟 show_level_cap.js 的 CLASS_PREFIX 做法一致）
    const CONTENT_BOX_PREFIX = "Actorpoolsrecord_contentOutBox__";

    const LIST_WRAPPER_ID = "uw-apr-list-wrapper";
    const SEARCH_CONTAINER_ID = "uw-apr-search-container";
    const PROCESSED_FLAG = "uwAprProcessed";

    // ---------------------------------------------------------
    // React Fiber 工具（沿用 show_level_cap.js 的手法）
    // ---------------------------------------------------------
    function getFiber(el) {
        const key = Object.keys(el).find(
            (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
        );
        return key ? el[key] : null;
    }

    // 往上（往父層元件 / Context Provider）找出握有 used_recruit_coupons 的資料物件
    function findDCContextValue(fiber) {
        let node = fiber;
        for (let i = 0; i < 200 && node; i++) {
            const props = node.memoizedProps;
            if (
                props &&
                typeof props === "object" &&
                props.value &&
                typeof props.value === "object" &&
                "used_recruit_coupons" in props.value &&
                "getUsed_recruit_coupons" in props.value
            ) {
                return props.value;
            }
            node = node.return;
        }
        return null;
    }

    // ---------------------------------------------------------
    // 抽卡紀錄整理邏輯（對應 Untitled-1-diff.js 裡 vI 的 useEffect，這裡改成純資料處理）
    // ---------------------------------------------------------
    function buildFlattenedCoupons(rawCoupons) {
        if (!Array.isArray(rawCoupons)) return [];

        // 1. 依 recruit_sequence 重新組合成「一箱一箱的抽卡事件」
        let groups = {};
        rawCoupons.forEach((item) => {
            if (!groups[item.recruit_sequence]) {
                groups[item.recruit_sequence] = {
                    recruit_sequence: item.recruit_sequence,
                    updated_at: item.updated_at,
                    items: []
                };
            }
            groups[item.recruit_sequence].items.push(item);
        });

        // 2. 依時間由舊到新排序，計算正向累積抽數（第幾抽 / 單抽 or 十抽）
        let chronoGroups = Object.values(groups).sort((a, b) => {
            if (a.updated_at < b.updated_at) return -1;
            if (a.updated_at > b.updated_at) return 1;
            if (a.recruit_sequence < b.recruit_sequence) return -1;
            if (a.recruit_sequence > b.recruit_sequence) return 1;
            return 0;
        });

        let totalPullsSoFar = 0;
        chronoGroups.forEach((group) => {
            let pullIndex = totalPullsSoFar + 1;
            let pullType;
            if (group.items.length > 1) {
                pullType = "(十抽)";
            } else {
                pullType = "(單抽)";
            }
            group.items.forEach((item) => {
                item.pullType = pullType;
                item.pullIndexLabel = "第 " + pullIndex + " 抽";
                item.group_updated_at = group.updated_at;
            });
            totalPullsSoFar += group.items.length;
        });

        // 3. 依顯示需求由新到舊排序，攤平成一維陣列
        let displayGroups = Object.values(groups).sort((a, b) => {
            if (a.updated_at > b.updated_at) return -1;
            if (a.updated_at < b.updated_at) return 1;
            if (a.recruit_sequence > b.recruit_sequence) return -1;
            if (a.recruit_sequence < b.recruit_sequence) return 1;
            return 0;
        });

        let finalCoupons = [];
        displayGroups.forEach((group) => {
            finalCoupons = finalCoupons.concat(group.items);
        });

        return finalCoupons;
    }

    function formatDate(item) {
        let formattedDate = "";
        try {
            let dateStr = item.group_updated_at || item.updated_at;
            if (typeof dateStr === "string" && !dateStr.endsWith("Z") && !dateStr.includes("+")) {
                dateStr = dateStr.replace(" ", "T") + "Z";
            }
            let dateObj = new Date(dateStr);
            let year = dateObj.getFullYear();
            let month = String(dateObj.getMonth() + 1).padStart(2, "0");
            let day = String(dateObj.getDate()).padStart(2, "0");
            let hours = String(dateObj.getHours()).padStart(2, "0");
            let minutes = String(dateObj.getMinutes()).padStart(2, "0");
            formattedDate = `${year}.${month}.${day} ${hours}:${minutes}`;
        } catch (err) {
            formattedDate = item.group_updated_at || item.updated_at || "";
        }
        return formattedDate;
    }

    // ---------------------------------------------------------
    // 只補「排版骨架」，顏色 / 字體 / 面板定位全部交給
    // actorpool_record_filter.css（custom-record-* / custom-search-container 那份樣式）
    // ---------------------------------------------------------
    function ensureStructuralStyle() {
        if (document.getElementById("uw-apr-structural-style")) return;
        const style = document.createElement("style");
        style.id = "uw-apr-structural-style";
        style.textContent = `
            .custom-record-row{
                display:flex; align-items:center; justify-content:space-between;
                gap:10px; padding:6px 4px; border-bottom:1px solid rgba(255,255,255,0.08);
            }
            .custom-record-row:last-child{ border-bottom:none; }
            .custom-record-name{ display:flex; align-items:center; }
            .custom-record-date{ display:flex; align-items:center; white-space:nowrap; }
            .uw-apr-empty{ opacity:.5; font-size:12px; padding:10px 4px; text-align:center; }
        `;
        document.head.appendChild(style);
    }

    // ---------------------------------------------------------
    // 建立「清單本體」與「搜尋/篩選控制面板」兩個元素
    // ---------------------------------------------------------
    function buildElements(nativeContentBox) {
        ensureStructuralStyle();

        // 清單本體：直接沿用原生內容區塊的 class，這樣定位/尺寸/捲動行為
        // 會跟原本遊戲畫面完全一致，不用自己再猜一次版位。
        const listWrapper = document.createElement("div");
        listWrapper.id = LIST_WRAPPER_ID;
        listWrapper.className = nativeContentBox.className;

        // 搜尋/篩選面板：對應 custom-search-container，由外部 CSS 決定絕對定位座標。
        const searchContainer = document.createElement("div");
        searchContainer.id = SEARCH_CONTAINER_ID;
        searchContainer.className = "custom-search-container";

        const filterState = { showSsr: true, showSr: true, showR: true, searchKey: "" };

        const checkboxGroup = document.createElement("div");
        checkboxGroup.className = "custom-checkbox-group";

        function makeCheckboxLabel(labelText, stateKey) {
            const label = document.createElement("label");
            label.className = "custom-checkbox-label";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = filterState[stateKey];
            input.addEventListener("change", () => {
                filterState[stateKey] = input.checked;
                render();
            });
            label.appendChild(input);
            label.appendChild(document.createTextNode(" " + labelText));
            return label;
        }

        checkboxGroup.appendChild(makeCheckboxLabel("SSR", "showSsr"));
        checkboxGroup.appendChild(makeCheckboxLabel("SR", "showSr"));
        checkboxGroup.appendChild(makeCheckboxLabel("R", "showR"));

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.className = "custom-search-input";
        searchInput.placeholder = "搜尋角色名稱...";
        searchInput.addEventListener("input", () => {
            filterState.searchKey = searchInput.value;
            render();
        });

        searchContainer.appendChild(checkboxGroup);
        searchContainer.appendChild(searchInput);

        function render() {
            const fiber = getFiber(nativeContentBox);
            const ctxValue = fiber ? findDCContextValue(fiber) : null;
            const rawCoupons = ctxValue ? ctxValue.used_recruit_coupons : null;
            const allItems = buildFlattenedCoupons(rawCoupons);

            const filtered = allItems.filter((item) => {
                let matchesSearch;
                if (!filterState.searchKey || (item.name && item.name.includes(filterState.searchKey))) {
                    matchesSearch = true;
                } else {
                    matchesSearch = false;
                }

                let rarity = String(item.scarcity).toLowerCase();
                let matchesRarity = true;
                if (rarity === "ssr") {
                    matchesRarity = filterState.showSsr;
                } else if (rarity === "sr") {
                    matchesRarity = filterState.showSr;
                } else if (rarity === "r") {
                    matchesRarity = filterState.showR;
                }

                return matchesSearch && matchesRarity;
            });

            listWrapper.innerHTML = "";

            if (filtered.length === 0) {
                const empty = document.createElement("div");
                empty.className = "uw-apr-empty";
                empty.textContent = "沒有符合條件的紀錄";
                listWrapper.appendChild(empty);
                return;
            }

            filtered.forEach((item) => {
                const originalIdx = allItems.indexOf(item);
                let isNew;
                if (allItems.slice(originalIdx + 1).some((olderItem) => olderItem.name === item.name)) {
                    isNew = false;
                } else {
                    isNew = true;
                }

                const rarityClass = " rarity-" + String(item.scarcity).toLowerCase();

                const row = document.createElement("div");
                row.className = "custom-record-row";

                const nameSpan = document.createElement("span");
                nameSpan.className = "custom-record-name" + rarityClass;
                nameSpan.appendChild(document.createTextNode(item.name || ""));

                const indexSpan = document.createElement("span");
                indexSpan.className = "custom-record-index";
                indexSpan.textContent = item.pullIndexLabel || "";
                nameSpan.appendChild(indexSpan);

                if (isNew) {
                    const newSpan = document.createElement("span");
                    newSpan.className = "custom-record-new";
                    newSpan.textContent = " (NEW)";
                    nameSpan.appendChild(newSpan);
                }

                const dateSpan = document.createElement("span");
                dateSpan.className = "custom-record-date";
                const pullTypeSpan = document.createElement("span");
                pullTypeSpan.className = "custom-record-pulltype";
                pullTypeSpan.textContent = item.pullType || "";
                dateSpan.appendChild(pullTypeSpan);
                dateSpan.appendChild(document.createTextNode(formatDate(item)));

                row.appendChild(nameSpan);
                row.appendChild(dateSpan);
                listWrapper.appendChild(row);
            });
        }

        render();
        return { listWrapper, searchContainer, render };
    }

    // ---------------------------------------------------------
    // 掛載：找到原生內容區塊 -> 隱藏它 -> 塞入我們自己的清單 + 搜尋面板
    // ---------------------------------------------------------
    function attach(nativeContentBox) {
        if (nativeContentBox.dataset[PROCESSED_FLAG]) return;
        nativeContentBox.dataset[PROCESSED_FLAG] = "1";

        nativeContentBox.style.display = "none";

        const { listWrapper, searchContainer, render } = buildElements(nativeContentBox);
        nativeContentBox.insertAdjacentElement("afterend", listWrapper);
        listWrapper.insertAdjacentElement("afterend", searchContainer);

        // 原生內容區塊雖然被隱藏，React 仍會照常更新它的內容（例如新抽到卡片）；
        // 監聽它的 DOM 變化，當作「資料更新了」的訊號，重新從 Fiber 撈資料、重繪清單。
        const dataObserver = new MutationObserver(() => render());
        dataObserver.observe(nativeContentBox, { childList: true, subtree: true, characterData: true });

        console.log("[APRFILTER] 已接管抽卡紀錄清單顯示");
    }

    function scan(root) {
        if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
        if (!root.querySelectorAll) return;
        root.querySelectorAll("div").forEach((el) => {
            if (
                el.className &&
                typeof el.className === "string" &&
                el.className.split(/\s+/).some((c) => c.indexOf(CONTENT_BOX_PREFIX) === 0)
            ) {
                attach(el);
            }
        });
    }

    const mountObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type !== "childList") continue;
            m.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;
                scan(node);
            });
        }
    });

    function start() {
        mountObserver.observe(document.documentElement, { childList: true, subtree: true });
        scan(document);
        console.log("[APRFILTER] 抽卡紀錄頁面監聽已啟動");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
