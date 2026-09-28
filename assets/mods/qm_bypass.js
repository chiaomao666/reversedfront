// QM 繞過模組 (QM Bypass)
// 解決問題：每次切換介面時，主程式會頻繁呼叫 `new Image()` (也就是 QM) 來檢查本機硬碟是否有該圖片。
// 這會在 Network 面板產生大量的 file:// 讀取請求，嚴重消耗系統與硬碟 I/O 資源。
// 解決方案：我們直接攔截 `new Image()` 的建構子。因為 React 渲染畫面是用 `document.createElement('img')`，
// 只有 QM 這種驗證腳本會用 `new Image()`。
// 我們可以讓所有 QM 的驗證「不發出實際請求，直接秒回報成功」，徹底消滅這些無用的驗證請求！

console.log("[QMBypass] QM 圖片驗證繞過模組已載入！");

(function() {
    if (window.__uwQMBypassPatched) return;
    window.__uwQMBypassPatched = true;

    const OriginalImage = window.Image;

    window.Image = function(w, h) {
        // 建立一個真實的圖片元素，以防其他模組檢查型別
        const img = new OriginalImage(w, h);
        
        // 攔截這個特定實例的 src 屬性
        Object.defineProperty(img, 'src', {
            set: function(val) {
                // 重點：我們「不」把 val 設定給真實的 src，所以瀏覽器「絕對不會」發出網路或硬碟請求！
                
                // 直接在下一個微任務中，假裝圖片已經瞬間讀取成功了
                setTimeout(() => {
                    const event = new Event("load");
                    img.dispatchEvent(event);
                    if (typeof img.onload === "function") {
                        img.onload(event);
                    }
                }, 0);
            },
            get: function() {
                return "";
            }
        });
        
        return img;
    };

    console.log("[QMBypass] 已成功覆寫 window.Image，所有 QM 驗證將被瞬間跳過，不再消耗網路/硬碟資源！");
})();
