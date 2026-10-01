/*
 * 據點戰公開戰況觀察（唯讀）
 *
 * 只讀取遊戲已經送到前端的 nation_battle / union_battle 廣播；
 * 不呼叫參戰、入盟、配對或任何會改變伺服器狀態的 API。
 */
(function () {
    "use strict";
    if (window.RFBattleStatsMonitorV9) return;
    window.RFBattleStatsMonitorV9 = true;

    const PANEL_ID = "rf-battle-monitor-panel";
    const CONTENT_ID = "rf-monitor-content";
    const MAX_FIBERS = 5000;
    const SWORD_MARKER_SELECTOR = 'img[class*="Attackmap_marker2swords__"]';
    const MARKER_BOX_SELECTOR = 'div[class*="Attackmap_markerCityBox__"]';
    const CITY_SENSOR_SELECTOR = '[data-sensor-city-id]';
    let panel;
    let lastSignature = "";
    let queued = false;
    let lastData = null;
    let storeSubscribed = false;
    let publicUpdatesConnected = false;
    const finishedCityIds = new Set();

    function fiberOf(element) {
        const key = element && Object.keys(element).find(key =>
            key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
        );
        return key ? element[key] : null;
    }

    function rootFiber() {
        let fiber = fiberOf(document.getElementById("root"));
        while (fiber?.return) fiber = fiber.return;
        return fiber;
    }

    function number(value) {
        const result = Number(value);
        return Number.isFinite(result) ? result : 0;
    }

    function format(value) {
        return number(value).toLocaleString("en-US");
    }

    function isContextValue(value) {
        return value && typeof value === "object" &&
            ("messages" in value || "msgRes" in value || Array.isArray(value.cities));
    }

    function findContexts() {
        const root = rootFiber();
        if (!root) return [];
        const contexts = [];
        const seen = new Set();
        const stack = [root];
        while (stack.length && seen.size < MAX_FIBERS) {
            const fiber = stack.pop();
            if (!fiber || seen.has(fiber)) continue;
            seen.add(fiber);
            for (const props of [fiber.memoizedProps, fiber.pendingProps]) {
                const value = props?.value;
                if (isContextValue(value) && !contexts.includes(value)) contexts.push(value);
            }
            let hook = fiber.memoizedState;
            for (let count = 0; hook && count < 30; count += 1, hook = hook.next) {
                if (isContextValue(hook.memoizedState) && !contexts.includes(hook.memoizedState)) contexts.push(hook.memoizedState);
            }
            if (fiber.child) stack.push(fiber.child);
            if (fiber.sibling) stack.push(fiber.sibling);
        }
        return contexts;
    }

    function eventName(message) {
        return `${message?.topic || ""},${message?.event || ""}`.toLowerCase();
    }

    function publicMessageFrom(context) {
        const direct = context.messages;
        const directPayload = payloadFrom(direct);
        if (/(nation_battle|union_battle)/.test(eventName(direct)) || cityBattlesFromPayload(directPayload).length) return direct;

        // msgRes 只保留尚未被畫面元件消費的回應；仍然只讀取，不主動請求更新。
        for (const [key, entry] of Object.entries(context.msgRes || {})) {
            const name = eventName(entry?.messages || entry);
            const payload = entry?.res?.payload;
            if (/(nation_battle|union_battle)/.test(name) || /(nation_battle|union_battle)/.test(key) ||
                cityBattlesFromPayload(payload).length) return entry?.messages || entry;
        }
        return null;
    }

    function payloadFrom(message) {
        return message?.res?.payload || message?.payload || null;
    }

    function extractTotals(payload) {
        const power = payload?.data?.power || payload?.power;
        if (!Array.isArray(power)) return null;
        const totals = power.reduce((sum, zone) => {
            const left = zone?.[0] || {};
            const right = zone?.[1] || {};
            sum.leftPower += number(left.power);
            sum.rightPower += number(right.power);
            sum.leftCommanders += number(left.commander);
            sum.rightCommanders += number(right.commander);
            return sum;
        }, { leftPower: 0, rightPower: 0, leftCommanders: 0, rightCommanders: 0 });
        return totals;
    }

    function cityBattlesFromPayload(payload) {
        const update = payload?.update_data || payload;
        const cities = Array.isArray(update?.cities) ? update.cities : [];
        return cities.flatMap(city => {
            const result = [];
            for (const type of ["nation_battle", "union_battle"]) {
                const battle = city?.[type];
                if (battle && typeof battle === "object") {
                    result.push({ cityId: city.id, cityName: city.name || city.city_name, type, battle, city });
                }
            }
            return result;
        });
    }

    function cityBattlesFromContext(context) {
        return cityBattlesFromPayload({ cities: context?.cities });
    }

    // 遊戲送出 unions 更新且目的地為 null、不可取消時，代表該聯盟已結束此次城市行動。
    // 只在 union.city.id 和 cities[].id 交叉比對成功時才排除；最外層的
    // cities[].id 才是城市 ID，nations[].id / unions[].id 分別是國家、聯盟 ID。
    function rememberFinishedCities(store) {
        const unions = Array.isArray(store?.unions) ? store.unions : [];
        const cityIds = new Set((Array.isArray(store?.cities) ? store.cities : [])
            .map(city => city?.id)
            .filter(id => id != null)
            .map(String));
        for (const union of unions) {
            const cityId = union?.city?.id;
            if (cityId != null && cityIds.has(String(cityId)) &&
                union.move_to_city === null && union.move_to_city_cancellable === false) {
                finishedCityIds.add(String(cityId));
            }
        }
    }

    function visibleBattles(battles) {
        return battles.filter(item =>
            !finishedCityIds.has(String(item.cityId)) &&
            // 主程式本身以 nation_battle_score 判斷「據點戰中」；只有 nation_battle
            // 代表預告／可點擊資訊，不能列為進行中的戰況。
            Boolean(item.city?.nation_battle_score) &&
            // 報到截止時間已過的項目不再列在進行中清單。沒有提供時間時保留，
            // 讓後續公開更新仍有機會補足資料。
            (!Number.isFinite(Date.parse(item.battle?.close_roll_call_at || "")) ||
                Date.parse(item.battle.close_roll_call_at) > Date.now())
        );
    }

    // 地圖上的雙刀圖示是遊戲目前畫面實際使用的交戰標記。它的判定比單一資料欄位
    // 更完整，因此在攻擊地圖頁優先以它的城市 ID 建立清單，再由 cities 補回名稱／活動資訊。
    function swordCityIdsFromMap() {
        const ids = new Set();
        document.querySelectorAll(SWORD_MARKER_SELECTOR).forEach(icon => {
            const box = icon.closest(MARKER_BOX_SELECTOR);
            const sensor = box?.querySelector(CITY_SENSOR_SELECTOR);
            if (sensor?.dataset?.sensorCityId) ids.add(String(sensor.dataset.sensorCityId));
        });
        return ids;
    }

    function mapBattlesFromStore(store) {
        const ids = swordCityIdsFromMap();
        if (!ids.size || !Array.isArray(store?.cities)) return [];
        const cities = new Map(store.cities.map(city => [String(city?.id), city]));
        const battles = [];
        for (const id of ids) {
            const city = cities.get(id);
            if (!city) continue;
            // 若畫面重新顯示雙刀，地圖優先，視為目前仍需列出。
            finishedCityIds.delete(id);
            battles.push({
                cityId: city.id,
                cityName: city.name || city.city_name,
                type: "nation_battle",
                battle: city.nation_battle && typeof city.nation_battle === "object" ? city.nation_battle : {},
                city
            });
        }
        return battles;
    }

    // rf_store.js 已經以穩定的方式找到遊戲的全域 React store。
    // 優先讀這個「套用過推播後」的 cities 陣列，避免直接掃完整 fiber 樹因遊戲版本而失效。
    function snapshotFromStore(store) {
        rememberFinishedCities(store);
        const mapBattles = mapBattlesFromStore(store);
        if (mapBattles.length) {
            return {
                event: "攻擊地圖雙刀標記 / cities",
                status: "地圖交戰中的城市",
                battles: mapBattles,
                timestamp: Date.now()
            };
        }
        const battles = visibleBattles(cityBattlesFromPayload({ cities: store?.cities }));
        return battles.length ? {
            event: "遊戲 cities 公開資料",
            status: "已收到公開城市戰況",
            battles,
            timestamp: Date.now()
        } : null;
    }

    function snapshot() {
        const storeData = snapshotFromStore(window.RFStore?.get?.());
        if (storeData) return storeData;
        for (const context of findContexts()) {
            const message = publicMessageFrom(context);
            const payload = payloadFrom(message);
            const messageBattles = cityBattlesFromPayload(payload);
            const contextBattles = cityBattlesFromContext(context);
            const battles = visibleBattles(messageBattles.length ? messageBattles : contextBattles);
            if (battles.length) {
                return {
                    event: messageBattles.length ? "all_players / update_data" : "遊戲目前城市資料",
                    status: "已收到公開城市戰況",
                    battles,
                    timestamp: Date.now()
                };
            }
            if (payload) {
                const name = eventName(message);
                if (/(nation_battle|union_battle)/.test(name)) {
                    return {
                        event: name || "公開戰況",
                        status: payload.status || payload.data?.status || "已收到公開資料",
                        round: payload.round ?? payload.data?.round,
                        totals: extractTotals(payload),
                        timestamp: Date.now()
                    };
                }
            }
        }
        return null;
    }

    function createPanel() {
        if (panel) return panel;
        panel = document.createElement("section");
        panel.id = PANEL_ID;
        panel.style.cssText = [
            "position:fixed", "left:18px", "top:200px", "width:244px", "max-height:calc(100vh - 220px)", "overflow-y:auto", "z-index:10000",
            "box-sizing:border-box", "padding:10px", "border:1px solid #a98432", "border-radius:6px",
            "background:rgba(10,12,10,.9)", "box-shadow:0 4px 16px rgba(0,0,0,.55)",
            "color:#f4f0dd", "font:12px/1.45 system-ui,sans-serif", "pointer-events:auto"
        ].join(";");
        panel.innerHTML = `
            <div style="margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #554a2a;color:#f0c75e;font-weight:700">◉ 據點戰公開戰況</div>
            <div id="${CONTENT_ID}" style="color:#a9aea4">等待遊戲載入公開戰況…</div>`;
        document.body.appendChild(panel);
        return panel;
    }

    function row(label, value, color) {
        return `<div style="display:flex;justify-content:space-between"><span>${label}</span><strong style="color:${color || "#f4f0dd"}">${value}</strong></div>`;
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>\"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
    }

    function countdown(isoTime) {
        const target = Date.parse(isoTime || "");
        if (!Number.isFinite(target)) return "未提供";
        const seconds = Math.ceil((target - Date.now()) / 1000);
        if (seconds <= 0) return "已截止";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remain = seconds % 60;
        return hours ? `${hours}時 ${minutes}分` : `${minutes}分 ${remain}秒`;
    }

    function render(data) {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;
        const status = String(data.status).replaceAll("_", " ");
        let html = row("狀態", status, "#f0c75e");
        if (data.battles?.length) {
            html += `<div style="margin-top:7px;padding-top:6px;border-top:1px solid #34342d">`;
            for (const item of data.battles) {
                const battle = item.battle;
                const kind = item.type === "nation_battle" ? "國家據點戰" : "聯盟據點戰";
                const city = item.cityName || `城市 #${item.cityId}`;
                const flags = [battle.sword && "sword", battle.knife && "knife", battle.knife_clickable && "knife_clickable"].filter(Boolean);
                html += `<div style="margin-top:6px;padding-top:5px;border-top:1px solid #34342d">`;
                html += row(escapeHtml(city), escapeHtml(kind), "#e6b86a");
                if (battle.id != null) html += row("活動 ID", escapeHtml(battle.id));
                if (battle.close_roll_call_at) html += row("報到倒數", countdown(battle.close_roll_call_at), "#f0c75e");
                if (flags.length) html += `<div style="margin-top:2px;color:#858b80;font-size:10px">公開旗標：${flags.join(" / ")}</div>`;
                html += "</div>";
            }
            html += "</div>";
        }
        if (data.round != null) html += row("回合", data.round);
        if (data.totals) {
            html += `<div style="margin-top:7px;padding-top:6px;border-top:1px solid #34342d">`;
            html += row("左側總戰力", format(data.totals.leftPower), "#6eb5ff");
            html += row("右側總戰力", format(data.totals.rightPower), "#ff8585");
            html += row("左側指揮官", format(data.totals.leftCommanders), "#6eb5ff");
            html += row("右側指揮官", format(data.totals.rightCommanders), "#ff8585");
            html += "</div>";
        } else {
            html += `<div style="margin-top:7px;color:#a9aea4">此公開事件未包含雙方總戰力。</div>`;
        }
        html += `<div style="margin-top:7px;color:#858b80;font-size:10px;word-break:break-all">來源：${data.event}<br>更新：${new Date(data.timestamp).toLocaleTimeString()}</div>`;
        content.innerHTML = html;
    }

    function renderUnavailable() {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;
        const blocked = /尚未加入任何聯盟|無法參與據點戰/.test(document.body.innerText || "");
        content.innerHTML = blocked
            ? (finishedCityIds.size
                ? `<div style="color:#a9aea4">目前沒有進行中的公開據點戰。</div>`
                : `<div style="color:#e6b86a">此帳號尚未取得據點戰公開資料。<br><span style="color:#a9aea4">遊戲目前只顯示參戰資格限制，未送出可讀戰況。</span></div>`)
            : `<div style="color:#a9aea4">等待遊戲載入公開戰況…</div>`;
    }

    function scan() {
        const data = snapshot();
        if (!data) {
            lastData = null;
            lastSignature = "";
            renderUnavailable();
            return;
        }
        publish(data);
    }

    function publish(data) {
        const signature = JSON.stringify([data.event, data.status, data.round, data.totals, data.battles]);
        lastData = data;
        if (signature === lastSignature) return;
        lastSignature = signature;
        render(data);
        console.log("[據點戰公開戰況] 已讀取公開事件", data);
    }

    function connectStore() {
        if (storeSubscribed || !window.RFStore?.subscribe) return storeSubscribed;
        storeSubscribed = true;
        window.RFStore.subscribe(store => {
            const data = snapshotFromStore(store);
            if (data) publish(data);
        });
        console.log("[據點戰公開戰況] 已接上 RFStore 城市資料");
        return true;
    }

    // DCContext 監測器會把遊戲已送到前端的 update_data 廣播到同頁的 BroadcastChannel。
    // cities 的增量更新若明確把 nation_battle 或 nation_battle_score 清成 null，主程式的
    // 合併式 cities state 有時仍會留下舊 battle 物件；這裡以城市 ID 記下清除狀態。
    function connectPublicCityUpdates() {
        if (publicUpdatesConnected || typeof BroadcastChannel === "undefined") return;
        publicUpdatesConnected = true;
        const channel = new BroadcastChannel("rf_dc_monitor");
        channel.onmessage = event => {
            const message = event?.data;
            if (message?.category !== "changed_cities" || !Array.isArray(message.records)) return;
            let changed = false;
            for (const record of message.records) {
                const cityId = record?.id;
                if (cityId == null) continue;
                const key = String(cityId);
                const hasBattle = Object.prototype.hasOwnProperty.call(record, "nation_battle");
                const hasScore = Object.prototype.hasOwnProperty.call(record, "nation_battle_score");
                if (hasScore && record.nation_battle_score) {
                    changed = finishedCityIds.delete(key) || changed;
                } else if ((hasBattle && !record.nation_battle) || (hasScore && !record.nation_battle_score)) {
                    if (!finishedCityIds.has(key)) {
                        finishedCityIds.add(key);
                        changed = true;
                    }
                }
            }
            if (changed) scan();
        };
        console.log("[據點戰公開戰況] 已監聽公開 cities 增量更新");
    }

    function queueScan() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            scan();
        });
    }

    function start() {
        createPanel();
        renderUnavailable();
        scan();
        const observer = new MutationObserver(queueScan);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener("hashchange", queueScan);
        window.setInterval(() => {
            connectStore();
            connectPublicCityUpdates();
            // 截止時間會自然流逝，必須重新篩選，不能只重畫上一秒的清單。
            scan();
        }, 1000);
        connectStore();
        connectPublicCityUpdates();
        console.log("[據點戰公開戰況] 已啟動（唯讀）");
    }

    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", start)
        : start();
})();
