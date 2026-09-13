/**
 * RF 專屬安全儲存密碼插件 (V8.4 - 深度 React 相容版)
 * 
 * 解決方案：
 * 1. 採用 React 原生 Setter 觸發法，完美模擬人類輸入，確保登入按鈕能讀取到密碼。
 * 2. 縮小 Input 搜尋範圍至 Form 內部，避免抓到頁面其他隱藏欄位。
 * 3. 攔截儲存機制的錯誤，確保絕對不阻擋遊戲原生的登入執行。
 */

(function() {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'savedAccounts',
        SALT: 0x55,
        encrypt: (str) => {
            if (!str) return '';
            let res = '';
            for (let i = 0; i < str.length; i++) res += String.fromCharCode(str.charCodeAt(i) ^ CONFIG.SALT);
            return btoa(encodeURIComponent(res));
        },
        decrypt: (enc) => {
            if (!enc) return '';
            try {
                const dec = decodeURIComponent(atob(enc));
                let res = '';
                for (let i = 0; i < dec.length; i++) res += String.fromCharCode(dec.charCodeAt(i) ^ CONFIG.SALT);
                return res;
            } catch (e) { return enc; }
        }
    };

    const SecureStorage = {
        getItem: (key) => {
            const val = localStorage.getItem(key);
            if (key === 'savedAccounts' && val) {
                try {
                    const list = JSON.parse(val);
                    return JSON.stringify(list.map(a => ({ ...a, password: CONFIG.decrypt(a.password) })));
                } catch(e) { return val; }
            }
            return val;
        },
        setItem: (key, val) => {
            if (key === 'savedAccounts' && val) {
                try {
                    const list = JSON.parse(val);
                    const encrypted = JSON.stringify(list.map(a => ({ ...a, password: CONFIG.encrypt(a.password) })));
                    localStorage.setItem(key, encrypted);
                } catch(e) { localStorage.setItem(key, val); }
            } else { localStorage.setItem(key, val); }
        }
    };

    function bootstrap() {
        console.log("%c[RF Plugin] V8.4 深度相容版已啟動", "color: #00ff00; font-weight: bold; background: #000; padding: 2px 6px; border-radius: 4px;");

        const tryInject = () => {
            const existingRoot = document.getElementById('rf-v8-root');
            if (existingRoot) return;

            let targetForm = document.getElementById('control-hooks');
            if (!targetForm) {
                const passInput = document.querySelector('input[type="password"]');
                if (passInput) targetForm = passInput.closest('form');
            }

            if (targetForm) {
                const inputs = Array.from(targetForm.querySelectorAll('input')).filter(i => 
                    i.type !== 'hidden' && i.type !== 'checkbox' && i.type !== 'radio' && i.type !== 'button' && i.type !== 'submit'
                );
                
                if (inputs.length >= 2) {
                    console.log("[RF Plugin] 找到目標表單，開始注入 V8.4 UI...");
                    injectUI(targetForm, inputs);
                }
            }
        };

        setInterval(tryInject, 800);
    }

    function injectUI(targetForm) {
        const root = document.createElement('div');
        root.id = 'rf-v8-root';

        root.style.cssText = `
            width: 100% !important;
            margin-top: 15px !important;
            padding: 12px !important;
            border-radius: 6px !important;
            background-color: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-sizing: border-box !important;
            position: relative !important;
            z-index: 10 !important;
        `;

        targetForm.appendChild(root);

        let currentPage = 0;
        const perPage = 4;
        let totalPages = 1;

        root.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            e.preventDefault(); 
            e.stopPropagation();

            if (btn.classList.contains('rf-pg')) {
                const dir = btn.dataset.dir;
                if (dir === 'prev' && currentPage > 0) currentPage--;
                else if (dir === 'next' && currentPage < totalPages - 1) currentPage++;
                render();
            } else if (btn.classList.contains('rf-acc')) {
                // 動態重新抓取 Input，避免 React 重繪導致元素脫離
                const currentInputs = Array.from(targetForm.querySelectorAll('input')).filter(i => 
                    i.type !== 'hidden' && i.type !== 'checkbox' && i.type !== 'radio' && i.type !== 'button' && i.type !== 'submit'
                );
                
                if (currentInputs.length >= 2) {
                    setReactValue(currentInputs[0], btn.dataset.email);
                    setReactValue(currentInputs[1], btn.dataset.pass);
                }
            } else if (btn.classList.contains('rf-del')) {
                if (confirm(`確定刪除 ${btn.dataset.email}？`)) {
                    let list = JSON.parse(SecureStorage.getItem("savedAccounts") || "[]");
                    list = list.filter(a => a.email !== btn.dataset.email);
                    SecureStorage.setItem("savedAccounts", JSON.stringify(list));
                    
                    const newTotalPages = Math.ceil(list.length / perPage) || 1;
                    if (currentPage >= newTotalPages) currentPage = newTotalPages - 1;
                    render();
                }
            }
        }, true);

        const render = () => {
            let savedAccounts = [];
            try {
                savedAccounts = JSON.parse(SecureStorage.getItem("savedAccounts") || "[]");
            } catch (e) { savedAccounts = []; }

            totalPages = Math.ceil(savedAccounts.length / perPage) || 1;
            const slice = savedAccounts.slice(currentPage * perPage, (currentPage + 1) * perPage);

            if (savedAccounts.length === 0) {
                root.style.display = 'none';
                return;
            } else {
                root.style.display = 'block';
            }

            let html = `
                <style>
                    .rf-btn:hover { background-color: rgba(255,255,255,0.15) !important; }
                    .rf-del:hover { background-color: rgba(255, 107, 107, 0.2) !important; transform: scale(1.05); }
                </style>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    ${totalPages > 1 ? `<button type="button" class="rf-pg" data-dir="prev" style="padding: 6px 10px; font-size: 14px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3); background-color: ${currentPage === 0 ? 'rgba(100,100,100,0.3)' : 'rgba(255,255,255,0.2)'}; color: ${currentPage === 0 ? 'rgba(255,255,255,0.5)' : '#fff'}; cursor: ${currentPage === 0 ? 'not-allowed' : 'pointer'}; transition: all 0.2s;" ${currentPage === 0 ? 'disabled' : ''}>◀</button>` : '<div style="width: 32px;"></div>'}
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="color: #fff; font-size: 13px; font-weight: 500;">快速選擇帳號</div>
                        ${totalPages > 1 ? `<div style="color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 2px;">第 ${currentPage + 1} 頁 / 共 ${totalPages} 頁</div>` : ''}
                    </div>
                    ${totalPages > 1 ? `<button type="button" class="rf-pg" data-dir="next" style="padding: 6px 10px; font-size: 14px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3); background-color: ${currentPage === totalPages - 1 ? 'rgba(100,100,100,0.3)' : 'rgba(255,255,255,0.2)'}; color: ${currentPage === totalPages - 1 ? 'rgba(255,255,255,0.5)' : '#fff'}; cursor: ${currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'}; transition: all 0.2s;" ${currentPage === totalPages - 1 ? 'disabled' : ''}>▶</button>` : '<div style="width: 32px;"></div>'}
                </div>
                <div style="display: grid; gap: 8px; grid-template-columns: 1fr;">
                    ${slice.map(acc => `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button type="button" class="rf-acc rf-btn" data-email="${acc.email}" data-pass="${acc.password}" style="flex: 1; padding: 8px 12px; font-size: 13px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background-color: rgba(255,255,255,0.05); color: #fff; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                                <span>${acc.email}</span>
                                <span style="font-size: 11px; color: ${acc.password ? '#4CAF50' : '#FF9800'};">${acc.password ? '🔐 完整資料' : '⚠️ 密碼遺失'}</span>
                            </button>
                            <button type="button" class="rf-del" data-email="${acc.email}" style="padding: 8px 10px; font-size: 12px; border-radius: 4px; border: 1px solid #ff6b6b; background-color: rgba(255, 107, 107, 0.1); color: #ff6b6b; cursor: pointer; transition: all 0.2s; min-width: 36px; display: flex; align-items: center; justify-content: center;">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            `;
            root.innerHTML = html;
        };

        render();

        let chkContainer = document.getElementById('rf-chk-container');
        if (!chkContainer) {
            chkContainer = document.createElement('div');
            chkContainer.id = 'rf-chk-container';
            chkContainer.style.cssText = 'margin-top: 10px; text-align: center;';
            chkContainer.innerHTML = `
                <label style="color: #fff; font-size: 14px; display: inline-flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="rf-rem-chk" style="margin-right: 8px; width: 16px; height: 16px;" checked>
                    記住帳號
                </label>
            `;
            targetForm.appendChild(chkContainer);
        }

        // 監聽登入按鈕，加入防錯機制
        document.addEventListener('mousedown', (e) => {
            try {
                const btn = e.target.closest('button, div');
                if (btn && (btn.innerText.includes('確定') || btn.innerText.includes('confirm') || btn.type === 'submit' || btn.classList.contains('ClickEffect'))) {
                    const currentInputs = Array.from(targetForm.querySelectorAll('input')).filter(i => 
                        i.type !== 'hidden' && i.type !== 'checkbox' && i.type !== 'radio' && i.type !== 'button' && i.type !== 'submit'
                    );
                    const chk = document.getElementById('rf-rem-chk');
                    
                    if (currentInputs.length >= 2 && chk && chk.checked) {
                        const email = currentInputs[0].value;
                        const pass = currentInputs[1].value;
                        if (email && pass) {
                            let list = JSON.parse(SecureStorage.getItem("savedAccounts") || "[]");
                            const idx = list.findIndex(a => a.email === email);
                            const data = { email, password: pass, lastUsed: Date.now() };
                            if (idx >= 0) list[idx] = data; else list.push(data);
                            list.sort((a, b) => b.lastUsed - a.lastUsed);
                            SecureStorage.setItem("savedAccounts", JSON.stringify(list));
                            localStorage.setItem("lastUsedEmail", email);
                            render();
                        }
                    }
                }
            } catch (err) {
                console.error('[RF Plugin] 儲存過程發生例外:', err);
            }
        }, true);
    }

    // 終極版 React 注入法
    function setReactValue(el, val) {
        if (!el) return;
        el.focus(); // 先取得焦點
        
        // 強制繞過 React 16+ 的攔截器，直接把值塞入底層 DOM
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        if (nativeSetter) {
            nativeSetter.call(el, val);
        } else {
            el.value = val;
        }
        
        // 模擬人類打字的事件廣播
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        
        el.blur(); // 失去焦點，觸發「已填寫」狀態
    }

    if (document.readyState === 'complete') bootstrap();
    else window.addEventListener('load', bootstrap);
})();