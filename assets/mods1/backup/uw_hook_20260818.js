// uw_hook.js - 獨立的 WebSocket 攔截副程式（v2：加上頁面內面板，方便一鍵複製/下載側錄結果）
console.log("[UW] 啟動外部副程式：WebSocket 攔截器已載入");

(function(){
    const captured = []; // { len, url, data, time }

    function addCapture(url, data){
        captured.push({
            len: data.length,
            url: url || '(unknown)',
            data: data,
            time: new Date().toLocaleTimeString()
        });
        updatePanel();
    }

    // ---- 攔截 WebSocket ----
    if (window.WebSocket) {
        const OriginalWebSocket = window.WebSocket;

        window.WebSocket = function(url, protocols) {
            console.log("[UW] [WebSocket] 攔截到連線，目標: ", url);
            const ws = new OriginalWebSocket(url, protocols);

            ws.addEventListener('message', function(event) {
                if (typeof event.data === 'string') {
                    // 【全量側錄】只要資料長度大於 2000 個字元（通常代表一次傳來大量清單），就存起來！
                    if (event.data.length > 2000) {
                        console.log("[UW] [發現大型資料包！長度: " + event.data.length + "]", event.data);
                        addCapture(url, event.data);
                    }
                }
            });

            const originalSend = ws.send;
            ws.send = function(data) {
                if (typeof data === 'string') {
                    if (data.includes('actor') || data.includes('pool')) {
                        console.log("[UW] [發送請求]", data);
                    }
                }
                return originalSend.apply(this, arguments);
            };
            return ws;
        };
        window.WebSocket.prototype = OriginalWebSocket.prototype;
    }

    // ---- 頁面內面板（外殼由 uw_panel.js 提供：展開／收合／貼邊）----
    let countEl, statusEl;

    function buildPanel(){
        if (!window.UWPanel) {
            console.warn('[UW] 找不到 UWPanel，側錄面板略過');
            return;
        }

        const panel = window.UWPanel.create({
            id: 'uw_hook',
            title: '[UW] 側錄面板',
            tabTitle: '側錄',
            side: 'right'
        });
        if (!panel) return;

        const style = document.createElement('style');
        style.textContent = `
            #uw-panel--uw_hook .uw-row{display:flex; gap:6px; margin-top:6px;}
            #uw-panel--uw_hook .uw-count{color:#8b9284; font-size:11px;}
            #uw-panel--uw_hook .uw-count b{color:#d9a441;}
            #uw-panel--uw_hook .uw-status{color:#6f9b5c; font-size:10.5px; margin-top:6px; min-height:14px;}
        `;
        document.head.appendChild(style);

        panel.body.innerHTML = `
            <div class="uw-count">已攔截 <b id="uw-count">0</b> 筆大型封包(大於 2000 個字元)</div>
            <div class="uw-row">
                <button type="button" id="uw-copy">複製全部</button>
                <button type="button" id="uw-dl">下載 .txt</button>
            </div>
            <div class="uw-row">
                <button type="button" id="uw-clear">清空</button>
            </div>
            <div class="uw-status" id="uw-status"></div>
        `;

        countEl = document.getElementById('uw-count');
        statusEl = document.getElementById('uw-status');

        document.getElementById('uw-copy').addEventListener('click', copyAll);
        document.getElementById('uw-dl').addEventListener('click', downloadAll);
        document.getElementById('uw-clear').addEventListener('click', clearAll);

        updatePanel();
    }

    function formatAll(){
        return captured.map(c =>
            `[UW] [封包 時間:${c.time} 長度:${c.len} URL:${c.url}]\n${c.data}`
        ).join('\n\n---\n\n');
    }

    const LARGE_WARN_LEN = 3 * 1024 * 1024; // 約 3MB 文字，超過就提醒改用下載比較保險

    function legacyCopyFallback(text){
        // navigator.clipboard 在某些情況（頁面失焦、內容過大、部分瀏覽器安全限制）會直接失敗且不丟明確錯誤
        // 用傳統 execCommand 當備援方案再試一次
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
        if(captured.length === 0){ flashStatus('目前沒有側錄到任何資料'); return; }
        const text = formatAll();

        if(text.length > LARGE_WARN_LEN){
            flashStatus('資料量偏大(' + (text.length/1024/1024).toFixed(1) + 'MB)，複製可能失敗，建議改用下載 .txt');
        }

        navigator.clipboard.writeText(text).then(function(){
            flashStatus('已複製 ' + captured.length + ' 筆到剪貼簿 ✓');
        }).catch(function(){
            const ok = legacyCopyFallback(text);
            flashStatus(ok ? '已複製 ' + captured.length + ' 筆到剪貼簿 ✓（備援方式）' : '複製失敗，資料量可能太大，請改用下載 .txt');
        });
    }

    function downloadAll(){
        if(captured.length === 0){ flashStatus('目前沒有側錄到任何資料'); return; }
        const blob = new Blob([formatAll()], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'uw_capture_' + Date.now() + '.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        flashStatus('已下載 ' + captured.length + ' 筆');
    }

    function clearAll(){
        captured.length = 0;
        updatePanel();
        flashStatus('已清空');
    }

    function updatePanel(){
        if(countEl) countEl.textContent = captured.length;
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
