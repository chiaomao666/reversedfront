// city_uploader.js - 從 dc_monitor_capture.js 側錄到的城市資料，整理後推送到 Supabase
// 在 loader.js 的 TOOLS 清單裡加入這支腳本即可，它會監聽 BroadcastChannel 裡的城市變動事件
console.log("[UPLOADER] 啟動外部副程式：城市資料上傳器已載入");

(function(){
    // ========== 設定區 ==========
    // 從 Supabase 後台 Settings > API 裡複製這兩個值
    const SUPABASE_URL = "https://bfecoizruicaaqxhmyqn.supabase.co";     // 例如 https://abcxyz.supabase.co
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZWNvaXpydWljYWFxeGhteXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjU1MzEsImV4cCI6MjEwNDMwMTUzMX0.k42rUGqjZSW77Nw4Ua9c2pBBjpZ-kGrttqvuiKX-I0c";    // 以 eyJ 開頭的那個 anon public key

    const CHANNEL_NAME = "rf_dc_monitor";
    const TABLE_NAME = "cities";                       // Supabase 裡的資料表名稱
    const MIN_UPLOAD_INTERVAL_MS = 30000;              // 同一筆城市資料最短多久上傳一次（毫秒，預設 30 秒）
    // ============================

    if (SUPABASE_URL === "填入你的_SUPABASE_URL" || SUPABASE_ANON_KEY === "填入你的_ANON_KEY") {
        console.warn("[UPLOADER] 尚未設定 Supabase 連線資訊，請打開 city_uploader.js 填入 SUPABASE_URL 和 SUPABASE_ANON_KEY");
        return;
    }

    const lastUploadTime = {}; // city_id -> timestamp，避免同一城市頻繁上傳
    const pendingCitySites = {}; // topic -> city_id，將請求與 response 對回

    // 新增：面板用的暫存陣列（不會影響上傳）
    const capturedCities = []; // 每筆為 { city_id, summary, rows, time }

    function supabaseUpsert(rows){
        return fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Prefer": "resolution=merge-duplicates" // upsert 語意：有就更新，沒有就新增
            },
            body: JSON.stringify(rows)
        });
    }

    function extractCityInfo(payload){
        // payload 可能是單一城市物件或城市陣列
        const cities = Array.isArray(payload) ? payload : [payload];
        const now = Date.now();
        const rows = [];

        for (const city of cities){
            if (!city || typeof city !== "object") continue;

            const id = city.id || city.city_id;
            if (!id) continue;

            // 節流：同一城市 30 秒內不重複上傳
            if (lastUploadTime[id] && (now - lastUploadTime[id]) < MIN_UPLOAD_INTERVAL_MS) continue;

            // 安全取值：布林欄位實際可能是物件或其他型別，一律存成 text 避免 400 錯誤
            function safeText(v){
                if (v === null || v === undefined) return null;
                if (typeof v === "string") return v;
                if (typeof v === "boolean" || typeof v === "number") return String(v);
                return JSON.stringify(v);
            }
            function safeBool(v){
                if (v === null || v === undefined) return null;
                if (typeof v === "boolean") return v;
                if (typeof v === "number") return v !== 0;
                return null; // 物件或字串就不推測，留 null
            }
            function safeNum(v){
                if (v === null || v === undefined) return null;
                const n = Number(v);
                return isNaN(n) ? null : n;
            }
            function formatRemainingTime(completedAt){
                if (!completedAt) return null;
                const seconds = Math.max(0, Math.ceil((new Date(completedAt).getTime() - now) / 1000));
                return seconds;
            }

            const king = city.uw_king || city.king || null;
            const dominance = city.uw_dominance || city.infiltration || null;
            const penetrationValue = safeNum(
                city.penetration_value ?? city.dominance_points ??
                city.uw_dominance_points ?? city.uw_my_dominance_points ??
                city.my_dominance_points
            );
            const workstations = Array.isArray(city.workstations)
                ? city.workstations
                : Array.isArray(city.sites)
                    ? city.sites.filter(site => site?.reference_type === "Workstation")
                    : [];
            const workstationDetails = workstations.map(ws => ({
                name: ws.ws_name || ws.name || null,
                level: safeNum(ws.level),
                remaining_seconds: formatRemainingTime(ws.completed_at),
                completed_at: ws.completed_at || null
            }));
            const remaining = workstationDetails
                .map(ws => ws.remaining_seconds)
                .filter(seconds => seconds !== null);

            rows.push({
                city_id:            id,
                name:               city.name              || null,  // 正確的城市名稱
                title:              city.title             || null,  // 劇情標題
                chapter_name:       city.chapter?.name     || null,
                chapter_number:     city.chapter?.number   ? String(city.chapter.number) : null,
                control_nation_id:  safeNum(city.control_nation?.id),
                control_nation_name:city.control_nation?.name || null,
                control_name:       city.control_name      || null,  // 主權玩家/聯盟名稱
                control_union_id:   safeNum(city.control_union?.id),   // 控制聯盟 ID
                control_union_name: city.control_union?.name || null,   // 控制聯盟名稱
                sovereign:          city.sovereign          || null,  // 主權
                hq:                 city.hq                 || null,  // HQ 聯盟
                hq_word:            city.hq_word            || null,  // HQ 稱號
                sovereign_flag:     city.sovereign_triangle_flag || null,
                energy_charge:      safeNum(city.energy_charge),
                x_position:         safeNum(city.x_position),
                y_position:         safeNum(city.y_position),
                nation_battle:      safeText(city.nation_battle),
                hijackable:         safeBool(city.hijackable),
                union_base:         safeBool(city.union_base),
                visible:            safeBool(city.visitable),
                uw_dominance:       dominance ? JSON.stringify(dominance) : null,
                infiltration:       dominance ? JSON.stringify(dominance) : null,
                penetration_value:  penetrationValue,
                king_id:             safeNum(king?.id ?? city.uw_king_id),
                king_name:           king?.nickname || king?.name || null,
                workstation_remaining_seconds: remaining.length ? Math.max(...remaining) : null,
                workstation_details: workstationDetails.length ? JSON.stringify(workstationDetails) : null,
                updated_at:         new Date().toISOString()
            });

            lastUploadTime[id] = now;
        }
        return rows;
    }

    async function handleCityData(payload){
        const rows = extractCityInfo(payload);
        if (rows.length === 0) return;

        // 新增：把要上傳的 rows 存到面板暫存（summary）
        try {
            // 儲存簡短 summary（不會包含過大物件）
            for (const r of rows) {
                capturedCities.push({
                    city_id: r.city_id,
                    summary: {
                        name: r.name,
                        chapter_name: r.chapter_name,
                        control_name: r.control_name,
                        penetration_value: r.penetration_value,
                        workstation_remaining_seconds: r.workstation_remaining_seconds,
                        updated_at: r.updated_at
                    },
                    rows: r,
                    time: new Date().toLocaleString()
                });
            }
            updatePanelCount();
        } catch (e) {
            console.warn("[UPLOADER] 面板儲存失敗：", e.message);
        }

        try {
            const resp = await supabaseUpsert(rows);
            if (resp.ok){
                console.log(`[UPLOADER] 成功上傳 ${rows.length} 筆城市資料`);
            } else {
                const err = await resp.text();
                console.warn("[UPLOADER] 上傳失敗：", resp.status, err);
            }
        } catch (e) {
            console.warn("[UPLOADER] 網路錯誤：", e.message);
        }
    }

    async function handleCitySites(payload, requestedCityId){
        const data = payload?.res?.payload || payload?.payload || payload;
        const cityId = data?.city_id || data?.cityId || requestedCityId;
        if (!cityId || !Array.isArray(data?.sites)) return;
        const now = Date.now();
        const details = data.sites
            .filter(site => site?.reference_type === "Workstation")
            .map(site => ({
                name: site.ws_name || site.name || null,
                level: safeNumber(site.workstation?.level ?? site.level),
                remaining_seconds: remainingSeconds(site.workstation?.completed_at),
                completed_at: site.workstation?.completed_at || null
            }));
        const remaining = details.map(site => site.remaining_seconds).filter(value => value !== null);

        const king = Array.isArray(data.kings) && data.kings.length > 0
            ? data.kings.find(k => k.rank === 1) || data.kings[0]
            : null;

        // 新增：把工作站更新也存到面板暫存
        try {
            capturedCities.push({
                city_id: cityId,
                summary: {
                    workstation_remaining_seconds: remaining.length ? Math.max(...remaining) : null,
                    updated_at: new Date().toLocaleString()
                },
                rows: {
                    infiltration: data.uw_dominance ? JSON.stringify(data.uw_dominance) : null,
                    penetration_value: safeNumber(
                        data.penetration_value ?? data.dominance_points ??
                        data.uw_dominance_points ?? data.uw_my_dominance_points ??
                        data.my_dominance_points
                    ),
                    workstation_remaining_seconds: remaining.length ? Math.max(...remaining) : null,
                    workstation_details: details.length ? JSON.stringify(details) : null,
                    updated_at: new Date().toISOString()
                },
                time: new Date().toLocaleString()
            });
            updatePanelCount();
        } catch (e) {
            console.warn("[UPLOADER] 面板儲存工作站資料失敗：", e.message);
        }

        try {
            const resp = await supabaseUpsert([{
                city_id: cityId,
                king_id:   king ? safeNumber(king.id) : null,
                king_name: king ? (king.nickname || king.name || null) : null,
                infiltration: data.uw_dominance ? JSON.stringify(data.uw_dominance) : null,
                penetration_value: safeNumber(
                    data.penetration_value ?? data.dominance_points ??
                    data.uw_dominance_points ?? data.uw_my_dominance_points ??
                    data.my_dominance_points
                ),
                workstation_remaining_seconds: remaining.length ? Math.max(...remaining) : null,
                workstation_completed_at: details.length
                    ? details.filter(d => d.completed_at).map(d => d.completed_at).sort().reverse()[0] || null
                    : null,
                workstation_details: details.length ? JSON.stringify(details) : null,
                updated_at: new Date().toISOString()
            }]);
            if (!resp.ok) console.warn("[UPLOADER] 工作站資料上傳失敗：", resp.status, await resp.text());
            else console.log(`[UPLOADER] 成功更新城市 ${cityId} 的工作站資料`);
        } catch (e) {
            console.warn("[UPLOADER] 工作站資料網路錯誤：", e.message);
        }
    }

    function safeNumber(value){
        if (value === null || value === undefined) return null;
        const number = Number(value);
        return Number.isNaN(number) ? null : number;
    }

    function remainingSeconds(completedAt){
        if (!completedAt) return null;
        return Math.max(0, Math.ceil((new Date(completedAt).getTime() - Date.now()) / 1000));
    }

    // 監聽 dc_monitor_capture.js 廣播的城市資料
    let channel;
    try {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = function(ev){
            const msg = ev.data;
            if (!msg) return;
            // 只處理城市變動類別
            if (msg.category === "changed_cities") {
                // msg.payload 是原始資料（dc_monitor_capture 這邊只傳了 summary）
                // 所以改成直接監聽 console.log 裡的完整資料
            }
        };
    } catch (e) {
        console.warn("[UPLOADER] BroadcastChannel 初始化失敗：", e.message);
    }

    // 改成直接檢查 _mergeData 的內容有沒有 chapter 欄位來判斷是城市而不是聯盟
    const _originalLog = console.log.bind(console);

    console.log = function(...args){
        const logText = args.find(arg => typeof arg === "string") || "";
        const request = args.find(arg => arg && typeof arg === "object" && arg.event === "city_sites");
        if (request?.message?.city_id && request.topic) {
            pendingCitySites[request.topic] = request.message.city_id;
        }
        if (/\[DCContext\]\s+\[response\]/i.test(logText) &&
            /city_sites/i.test(String(args[1] || ""))) {
            const responseKey = String(args[1]);
            const topic = responseKey.split(",")[0];
            handleCitySites(args[2], pendingCitySites[topic]);
            delete pendingCitySites[topic];
        }
        if (args.length > 0 && typeof args[0] === "string" &&
            args[0].indexOf("[DCContext]") === 0 &&
            /_mergeData/i.test(args[0]) &&
            Array.isArray(args[1]) && args[1].length > 0 &&
            args[1][0]?.chapter !== undefined) {
            // 有 chapter 欄位 = 城市資料，不是聯盟資料
            handleCityData(args[1]);
        }
        return _originalLog(...args);
    };

    console.log("[UPLOADER] 監聽已啟動，將在偵測到城市資料時自動上傳到 Supabase");

    // ---------------- 面板 UI 與下載/複製功能 ----------------
    let panelEl, countEl, statusEl;

    function buildPanel(){
        const style = document.createElement('style');
        style.textContent = `
            #cu-panel{
                position:fixed; right:14px; bottom:14px; z-index:2147483647;
                width:300px; max-height:60vh; font-family:ui-monospace,Menlo,Consolas,monospace;
                background:#0f1720; color:#e6eef6; border:1px solid #22303a;
                border-radius:6px; box-shadow:0 6px 24px rgba(0,0,0,.6);
                font-size:12px; overflow:hidden;
            }
            #cu-panel .head{
                background:#0b1220; padding:8px 10px; display:flex;
                align-items:center; justify-content:space-between; cursor:move;
                border-bottom:1px solid #22303a;
            }
            #cu-panel .head b{color:#7dd3fc; font-weight:600; font-size:12px;}
            #cu-panel .body{padding:10px; overflow:auto; max-height:44vh;}
            #cu-panel .row{display:flex; gap:6px; margin-top:6px;}
            #cu-panel button{
                flex:1; background:#0f1720; color:#e6eef6; border:1px solid #2b4756;
                border-radius:3px; padding:6px 6px; font-size:12px; cursor:pointer;
                font-family:inherit;
            }
            #cu-panel button:hover{background:#7dd3fc; color:#072030;}
            #cu-panel .count{color:#9fb6c6; font-size:12px;}
            #cu-panel .count b{color:#7dd3fc;}
            #cu-panel .status{color:#9fe6b0; font-size:11px; margin-top:6px; min-height:16px;}
            #cu-panel .min{cursor:pointer; color:#9fb6c6; font-size:14px; user-select:none;}
            #cu-panel .list{margin-top:8px; font-size:11px; color:#cfeaf6; max-height:22vh; overflow:auto;}
            #cu-panel .item{padding:6px; border-bottom:1px dashed rgba(125,211,252,0.08);}
            #cu-panel .item small{color:#9fb6c6; display:block; margin-top:4px;}
        `;
        document.head.appendChild(style);

        panelEl = document.createElement('div');
        panelEl.id = 'cu-panel';
        panelEl.innerHTML = `
            <div class="head" id="cu-drag">
                <b>[UPLOADER] 城市側錄面板</b>
                <span class="min" id="cu-min">—</span>
            </div>
            <div class="body" id="cu-body">
                <div class="count">已收集 <b id="cu-count">0</b> 筆城市資料</div>
                <div class="row">
                    <button id="cu-copy">複製全部</button>
                    <button id="cu-dl">下載 .txt</button>
                </div>
                <div class="row">
                    <button id="cu-clear">清空</button>
                </div>
                <div class="status" id="cu-status"></div>
                <div class="list" id="cu-list"></div>
            </div>
        `;
        document.body.appendChild(panelEl);

        countEl = document.getElementById('cu-count');
        statusEl = document.getElementById('cu-status');

        document.getElementById('cu-copy').addEventListener('click', copyAll);
        document.getElementById('cu-dl').addEventListener('click', downloadAll);
        document.getElementById('cu-clear').addEventListener('click', clearAll);

        const body = document.getElementById('cu-body');
        const minBtn = document.getElementById('cu-min');
        let collapsed = false;
        minBtn.addEventListener('click', function(){
            collapsed = !collapsed;
            body.style.display = collapsed ? 'none' : 'block';
            minBtn.textContent = collapsed ? '+' : '—';
        });

        // 拖曳
        const dragHandle = document.getElementById('cu-drag');
        let dragging = false, offX = 0, offY = 0;
        dragHandle.addEventListener('mousedown', function(e){
            dragging = true;
            const rect = panelEl.getBoundingClientRect();
            offX = e.clientX - rect.left;
            offY = e.clientY - rect.top;
        });
        document.addEventListener('mousemove', function(e){
            if(!dragging) return;
            panelEl.style.left = (e.clientX - offX) + 'px';
            panelEl.style.top = (e.clientY - offY) + 'px';
            panelEl.style.right = 'auto';
            panelEl.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', function(){ dragging = false; });

        updatePanelList();
    }

    function formatAll(){
        // 將 capturedCities 轉成可讀文字（每筆 JSON pretty）
        return capturedCities.map(c => {
            return `[CITY] 時間:${c.time} city_id:${c.city_id}\nSUMMARY:\n${JSON.stringify(c.summary, null, 2)}\nDATA:\n${JSON.stringify(c.rows, null, 2)}`;
        }).join('\n\n---\n\n');
    }

    const LARGE_WARN_LEN = 3 * 1024 * 1024; // 約 3MB 文字，超過就提醒改用下載比較保險

    function legacyCopyFallback(text){
        try{
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        }catch(e){
            return false;
        }
    }

    function copyAll(){
        if(capturedCities.length === 0){ flashStatus('目前沒有收集到任何城市資料'); return; }
        const text = formatAll();

        if(text.length > LARGE_WARN_LEN){
            flashStatus('資料量偏大(' + (text.length/1024/1024).toFixed(1) + 'MB)，複製可能失敗，建議改用下載 .txt');
        }

        navigator.clipboard.writeText(text).then(function(){
            flashStatus('已複製 ' + capturedCities.length + ' 筆到剪貼簿 ✓');
        }).catch(function(){
            const ok = legacyCopyFallback(text);
            flashStatus(ok ? '已複製 ' + capturedCities.length + ' 筆到剪貼簿 ✓（備援方式）' : '複製失敗，資料量可能太大，請改用下載 .txt');
        });
    }

    function downloadAll(){
        if(capturedCities.length === 0){ flashStatus('目前沒有收集到任何城市資料'); return; }
        const blob = new Blob([formatAll()], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'city_uploader_capture_' + Date.now() + '.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        flashStatus('已下載 ' + capturedCities.length + ' 筆');
    }

    function clearAll(){
        capturedCities.length = 0;
        updatePanelCount();
        updatePanelList();
        flashStatus('已清空');
    }

    function updatePanelCount(){
        if(countEl) countEl.textContent = capturedCities.length;
        updatePanelList();
    }

    function updatePanelList(){
        const listEl = document.getElementById('cu-list');
        if(!listEl) return;
        listEl.innerHTML = '';
        const maxShow = 30;
        const start = Math.max(0, capturedCities.length - maxShow);
        for (let i = capturedCities.length - 1; i >= start; i--){
            const c = capturedCities[i];
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `<div><strong>city_id:</strong> ${c.city_id} <small>${c.time}</small></div>
                              <small>${c.summary && c.summary.name ? c.summary.name : ''} ${c.summary && c.summary.control_name ? ' / ' + c.summary.control_name : ''}</small>`;
            listEl.appendChild(item);
        }
        if (capturedCities.length > maxShow){
            const more = document.createElement('div');
            more.className = 'item';
            more.innerHTML = `<small>... 顯示最近 ${maxShow} 筆，共 ${capturedCities.length} 筆</small>`;
            listEl.appendChild(more);
        }
    }

    function flashStatus(msg){
        if(!statusEl) return;
        statusEl.textContent = msg;
        setTimeout(function(){ if(statusEl.textContent === msg) statusEl.textContent = ''; }, 2500);
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', buildPanel);
    } else {
        buildPanel();
    }

})();
