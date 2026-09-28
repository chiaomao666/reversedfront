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
    // ---------------------------------------------------------
    // WebSocket 攔截：在資料源頭把「抽卡歷史紀錄」裁短，餵給遊戲原生元件
    // ---------------------------------------------------------
    // 背景：main.js 裡 Actorpoolsrecord 頁面用到的 t.used_recruit_coupons 是靠遊戲的
    // Phoenix Channels WebSocket 拿的：
    //   送出：Ao.sendMessage({ topic: Zn, event: "used_recruit_coupons", message: {} })
    //   收到：case `${Zn},used_recruit_coupons`: status=="ok" && gt(payload)  // gt = setUsed_recruit_coupons
    // 光是把畫面隱藏(display:none)沒有用——原生的 yI/_I 卡片元件還是照樣會為這上萬筆
    // 資料的「每一筆」去 mount、去呼叫圖片預載（HM/QM/new Image()），這些都是在 React
    // 層面發生的事，跟 CSS 看不看得到無關。真正要省效能，必須讓餵給 React 的資料本身
    // 就只有一小份，而不是餵完整的一萬多筆再藏起來。
    //
    // 做法：monkey-patch window.WebSocket。送出的封包如果是 event === "used_recruit_coupons"
    // 的 push，記住它的 ref；收到對應 ref 的 phx_reply 時，把完整資料先存一份給我們自己的
    // 搜尋清單用，再把要交還給遊戲本體那份陣列裁短（只留看起來最新的 N 筆），這樣原生
    // 格線只需要處理少量資料，圖片預載次數就會從上萬次降到幾十次。
    // Phoenix 封包有新舊兩種格式：
    //   陣列格式（v2 serializer）：[join_ref, ref, topic, event, payload]
    //   物件格式（v1 serializer）：{ topic, event, payload, ref }
    // 兩種都處理；遇到看不懂的格式一律直接放行、不做任何修改，避免弄壞其他正常的
    // socket 功能（例如 PVP 監控之類其他 mod 也在用同一條連線）。
    const NATIVE_RENDER_KEEP = 10; // 留給原生（已隱藏）格線的筆數上限
    const RECRUIT_COUPONS_EVENT = "used_recruit_coupons";
    const FULL_DATA_GLOBAL_KEY = "__uwFullUsedRecruitCoupons";

    function readFrame(parsed) {
        if (Array.isArray(parsed) && parsed.length >= 5) {
            return { format: "array", ref: parsed[1], topic: parsed[2], event: parsed[3], payload: parsed[4] };
        }
        if (parsed && typeof parsed === "object" && "event" in parsed && "topic" in parsed) {
            return { format: "object", ref: parsed.ref, topic: parsed.topic, event: parsed.event, payload: parsed.payload };
        }
        return null;
    }

    function writeFrame(parsed, frame, newPayload) {
        if (frame.format === "array") {
            const copy = parsed.slice();
            copy[4] = newPayload;
            return copy;
        }
        return { ...parsed, payload: newPayload };
    }

    // 陣列可能是新到舊或舊到新排序，用 updated_at 判斷方向後，抓「看起來最新」的那一端。
    function keepMostRecent(list, n) {
        if (!Array.isArray(list) || list.length <= n) return list;
        const first = list[0];
        const last = list[list.length - 1];
        if (first && last && first.updated_at && last.updated_at && first.updated_at < last.updated_at) {
            return list.slice(-n); // 舊到新排序，最新的在尾端
        }
        return list.slice(0, n); // 預設當作新到舊排序
    }

    (function patchWebSocket() {
        if (window.__uwAprWsPatched) return; // 避免重複掛（例如腳本被載入兩次）
        window.__uwAprWsPatched = true;

        const OriginalWebSocket = window.WebSocket;
        if (typeof OriginalWebSocket !== "function") return;

        function PatchedWebSocket(url, protocols) {
            const ws = protocols !== undefined ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
            const pendingRefs = new Set();

            const originalSend = ws.send.bind(ws);
            ws.send = function (data) {
                try {
                    if (typeof data === "string") {
                        const parsed = JSON.parse(data);
                        const frame = readFrame(parsed);
                        if (frame && frame.event === RECRUIT_COUPONS_EVENT) {
                            pendingRefs.add(frame.ref);
                        }
                    }
                } catch (e) {
                    // 不是 JSON 或格式看不懂，忽略，原封不動送出即可
                }
                return originalSend(data);
            };

            ws.addEventListener(
                "message",
                function (event) {
                    if (pendingRefs.size === 0) return;
                    if (typeof event.data !== "string") return;

                    let parsed;
                    try {
                        parsed = JSON.parse(event.data);
                    } catch (e) {
                        return;
                    }

                    const frame = readFrame(parsed);
                    if (!frame || frame.event !== "phx_reply" || !pendingRefs.has(frame.ref)) return;
                    pendingRefs.delete(frame.ref);

                    const reply = frame.payload;
                    if (!reply || reply.status !== "ok" || !Array.isArray(reply.response)) return;

                    // 完整資料先留一份給我們自己的搜尋清單用（不受裁短影響）
                    window[FULL_DATA_GLOBAL_KEY] = reply.response;

                    if (reply.response.length <= NATIVE_RENDER_KEEP) return; // 資料量不大，不用裁

                    const trimmedResponse = keepMostRecent(reply.response, NATIVE_RENDER_KEEP);
                    const newParsed = writeFrame(parsed, frame, { ...reply, response: trimmedResponse });
                    const newData = JSON.stringify(newParsed);

                    console.log(
                        "[APRFILTER] 已攔截抽卡歷史紀錄，原生元件只會收到 " +
                            trimmedResponse.length +
                            " / " +
                            reply.response.length +
                            " 筆（完整資料已另外保留給搜尋面板）"
                    );

                    // 攔下原始事件，改丟一個資料被裁短過的版本給遊戲本體的監聽器
                    event.stopImmediatePropagation();
                    ws.dispatchEvent(new MessageEvent("message", { data: newData }));
                },
                true // capture 階段：搶在遊戲本體自己的 onmessage 監聽器之前處理
            );

            return ws;
        }

        PatchedWebSocket.prototype = OriginalWebSocket.prototype;
        Object.getOwnPropertyNames(OriginalWebSocket).forEach((key) => {
            if (key === "prototype" || key === "length" || key === "name") return;
            try {
                PatchedWebSocket[key] = OriginalWebSocket[key];
            } catch (e) {}
        });

        window.WebSocket = PatchedWebSocket;
        console.log("[APRFILTER] WebSocket 攔截已掛上，準備裁短抽卡歷史紀錄流量");
    })();

    // Actorpoolsrecord 內容區塊的 class（webpack CSS module 的雜湊後綴每次改版都可能不同，
    // 所以只比對到 "__" 前面這段固定字首，跟 show_level_cap.js 的 CLASS_PREFIX 做法一致）
    const CONTENT_BOX_PREFIX = "Actorpoolsrecord_contentOutBox__";
    // CSS 裡的 [class^="Actorpoolsrecord_bgLightBox__"] 只是先讓它「看不見」；
    // 瀏覽器對 inline style 設定的 background-image（尤其是動態 GIF）就算 display:none
    // 通常還是會持續解碼、播放動畫，白白吃掉效能。這裡直接把整個節點砍掉才會真的停止。
    const BG_LIGHT_PREFIX = "Actorpoolsrecord_bgLightBox__";

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
        let tenPullIndex = 1;
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
                if (pullType === "(單抽)") {
                    item.pullIndexLabel = "第 " + pullIndex + " 抽";
                } else {
                    item.pullIndexLabel = "第 " + pullIndex + " - " + tenPullIndex + " 抽";
                    tenPullIndex += 1;
                    if (tenPullIndex > 10) {
                        tenPullIndex = 1;
                    }
                }
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
            // 編號（~1 ~ ~10）維持照抽卡當下實際的第一張到第十張，
            // 但畫面上「新到舊」由上而下的原則要延續到箱子內部：
            // 同一箱裡最後抽到的（~10）在時間上最新，所以顯示時排在最上面，
            // 最先抽到的（~1）排在最下面（單抽只有一張，反過來也不影響）。
            finalCoupons = finalCoupons.concat(group.items.slice().reverse());
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

        // 資料量可能高達上萬筆，重新分組 + 排序很花時間；rawCoupons 陣列參照沒變
        // （代表資料其實沒真的更新，只是隱藏區塊裡發生了不相干的 DOM 變動）就直接
        // 沿用上次算好的結果，不用整包重跑。
        let cachedRawCoupons = null;
        let cachedAllItems = [];

        // 目前顯示筆數（避免資料量大時一次生出上萬個 DOM 節點造成瞬間凍結，
        // 改成先顯示一部分，其餘用「載入更多」逐步展開）
        let visibleCount = 2000;
        const PAGE_SIZE = 2000;

        function render() {
            const fiber = getFiber(nativeContentBox);
            const ctxValue = fiber ? findDCContextValue(fiber) : null;
            // 優先用 WebSocket 攔截時保留下來的完整資料；那份沒有被裁短過。
            // 如果因為某些原因（例如 mod 晚載入、錯過了那次封包）沒攔到，才退回去用
            // React Context 目前手上那份（此時很可能已經被我們自己裁短過，筆數會比較少）。
            const rawCoupons = window[FULL_DATA_GLOBAL_KEY] || (ctxValue ? ctxValue.used_recruit_coupons : null);

            let allItems;
            if (rawCoupons === cachedRawCoupons) {
                allItems = cachedAllItems;
            } else {
                allItems = buildFlattenedCoupons(rawCoupons);

                // NEW 的原始語意是「這是該角色史上第一次被抽到的那一筆」（最早、最舊的那次），
                // 不是「最近一次抽到」。allItems 是新到舊排序，所以要從陣列尾端（最舊）往前掃，
                // 第一次遇到某個名字的當下（也就是時間上最早那筆）才標記 isNew=true；
                // 同一個名字之後（其實是時間上更新）的每一筆都是 false。
                // 依然只掃一次，維持 O(n)，只是方向反過來。
                let seenNames = new Set();
                for (let idx = allItems.length - 1; idx >= 0; idx--) {
                    const item = allItems[idx];
                    if (seenNames.has(item.name)) {
                        item.isNew = false;
                    } else {
                        item.isNew = true;
                        seenNames.add(item.name);
                    }
                }

                cachedRawCoupons = rawCoupons;
                cachedAllItems = allItems;
                visibleCount = PAGE_SIZE; // 資料真的變了（例如抽了新的），重置回第一頁
            }

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

            const toShow = filtered.slice(0, visibleCount);

            toShow.forEach((item) => {
                const rarityClass = " rarity-" + String(item.scarcity).toLowerCase();

                const row = document.createElement("div");
                row.className = "custom-record-row";

                const nameSpan = document.createElement("span");
                nameSpan.className = "custom-record-name" + rarityClass;
                nameSpan.appendChild(document.createTextNode(item.name || ""));

                if (item.isNew) {
                    const newSpan = document.createElement("span");
                    newSpan.className = "custom-record-new";
                    newSpan.textContent = " (NEW)";
                    nameSpan.appendChild(newSpan);
                }
                
                const indexSpan = document.createElement("span");
                indexSpan.className = "custom-record-index";
                indexSpan.textContent = item.pullIndexLabel || "";
                nameSpan.appendChild(indexSpan);

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

            if (filtered.length > visibleCount) {
                const loadMore = document.createElement("div");
                loadMore.className = "custom-record-row uw-apr-load-more";
                loadMore.textContent = `載入更多（還有 ${filtered.length - visibleCount} 筆，目前顯示 ${visibleCount} 筆）`;
                loadMore.style.cursor = "pointer";
                loadMore.style.justifyContent = "center";
                loadMore.style.opacity = "0.7";
                loadMore.addEventListener("click", () => {
                    visibleCount += PAGE_SIZE;
                    render();
                });
                listWrapper.appendChild(loadMore);
            }
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
        // 資料量大時，若每一次細微 DOM 變動都立刻整包重繪一次會非常吃效能，
        // 所以這裡加上 debounce，短時間內多次變動只會在安靜下來後重繪「一次」；
        // 另外拿掉 characterData，只看子節點增減（新抽到的卡片一定是新增節點，
        // 不會只是改文字），大幅減少不必要的觸發次數。
        let renderTimer = null;
        function scheduleRender() {
            if (renderTimer) clearTimeout(renderTimer);
            renderTimer = setTimeout(render, 300);
        }
        const dataObserver = new MutationObserver(scheduleRender);
        dataObserver.observe(nativeContentBox, { childList: true, subtree: true });

        console.log("[APRFILTER] 已接管抽卡紀錄清單顯示");
    }

    function hasPrefix(el, prefix) {
        return (
            el &&
            el.className &&
            typeof el.className === "string" &&
            el.className.split(/\s+/).some((c) => c.indexOf(prefix) === 0)
        );
    }

    function removeBgLightGif(el) {
        if (!hasPrefix(el, BG_LIGHT_PREFIX)) return;
        el.remove();
        console.log("[APRFILTER] 已移除背景 GIF 元素（非只是隱藏，避免持續解碼耗效能）");
    }

    function scan(root) {
        if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
        if (!root.querySelectorAll) return;
        root.querySelectorAll("div").forEach((el) => {
            removeBgLightGif(el);
            if (hasPrefix(el, CONTENT_BOX_PREFIX)) {
                attach(el);
            }
        });
    }

    const mountObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type !== "childList") continue;
            m.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;
                removeBgLightGif(node);
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
