(() => {
    "use strict";

    const MOD_NAME = "Home Gear Blocker";
    let isBlocked = false;

    /**
     * 尋找並停止 React Spring 動畫控制器
     * 遊戲主程式在 Home 元件中使用 wa (useSpring) 驅動齒輪
     */
    function stopGearAnimations() {
        // 齒輪容器的特徵 Class
        const gearImgs = document.querySelectorAll('img[class*="Home_gearImg"]');
        if (gearImgs.length === 0) return false;

        let stoppedCount = 0;
        gearImgs.forEach(img => {
            // 尋找 React Fiber 節點
            const key = Object.keys(img).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (!key) return;

            let fiber = img[key];
            let depth = 0;
            while (fiber && depth < 20) {
                // react-spring 的控制器通常存在於 memoizedProps 或 stateNode 中
                const props = fiber.memoizedProps;
                if (props && props.style && typeof props.style.stop === 'function') {
                    props.style.stop();
                    stoppedCount++;
                    break;
                }
                fiber = fiber.return;
                depth++;
            }
        });

        if (stoppedCount > 0) {
            console.log(`[${MOD_NAME}] 已成功停止 ${stoppedCount} 個齒輪的 JS 動畫循環。`);
            return true;
        }
        return false;
    }

    // 使用 MutationObserver 監測首頁載入
    const observer = new MutationObserver((mutations) => {
        if (isBlocked) return;
        
        // 檢查是否進入首頁 (特徵元素)
        if (document.querySelector('div[class*="Home_gearContainer"]')) {
            if (stopGearAnimations()) {
                isBlocked = true;
                // 成功停止後可以斷開觀察器，節省效能
                observer.disconnect();
            }
        }
    });

    // 啟動監測
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始檢查
    setTimeout(stopGearAnimations, 1000);

    console.log(`[${MOD_NAME}] 已載入，監控首頁齒輪 JS 變動。`);
})();
