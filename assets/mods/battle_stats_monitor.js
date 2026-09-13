/**
 * RF Battle Stats Monitor v1.0
 * 監測據點戰雙方人數及戰力的即時變化
 */
(function() {
    const MONITOR_NAME = '據點戰數據監測';
    let lastStats = null;
    let changeLog = [];
    let monitorTimer = null;
    let uiPanel = null;

    // 取得 React Fiber 節點的屬性
    function getFiberProps(el) {
        const key = Object.keys(el).find(k => k.startsWith('__reactProps$') || k.startsWith('__reactInternalInstance$'));
        if (!key) return null;
        
        // 向上尋找包含 battleInfo 的 props
        let fiber = el[key];
        let depth = 0;
        while (fiber && depth < 50) {
            const props = fiber.memoizedProps || fiber.pendingProps;
            if (props && props.battleInfo) {
                return props.battleInfo;
            }
            fiber = fiber.return;
            depth++;
        }
        return null;
    }

    // 建立 UI 面板
    function createUIPanel() {
        if (uiPanel) return;
        
        uiPanel = document.createElement('div');
        uiPanel.id = 'rf-battle-monitor-panel';
        uiPanel.style.cssText = `
            position: fixed;
            left: 20px;
            top: 200px;
            width: 220px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid #444;
            border-radius: 8px;
            color: white;
            font-family: sans-serif;
            font-size: 12px;
            z-index: 10000;
            padding: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            pointer-events: none;
            display: none;
        `;
        
        uiPanel.innerHTML = `
            <div style="border-bottom: 1px solid #666; padding-bottom: 5px; margin-bottom: 8px; font-weight: bold; color: #ffcc00;">
                ⚔️ 戰場即時情報
            </div>
            <div id="rf-monitor-content">
                <div style="color: #aaa; text-align: center;">正在等待戰場數據...</div>
            </div>
        `;
        
        document.body.appendChild(uiPanel);
    }

    // 格式化數字
    function fmt(num) {
        return num.toLocaleString();
    }

    // 計算並顯示變化
    function updateStats(current) {
        if (!current || !current.offender || !current.defender) return;

        const now = {
            offPower: current.offender.power || 0,
            offCount: current.offender.roll_count || 0,
            defPower: current.defender.power || 0,
            defCount: current.defender.roll_count || 0,
            time: Date.now()
        };

        if (!lastStats) {
            lastStats = now;
            renderUI(now, null);
            return;
        }

        const diff = {
            offPower: now.offPower - lastStats.offPower,
            offCount: now.offCount - lastStats.offCount,
            defPower: now.defPower - lastStats.defPower,
            defCount: now.defCount - lastStats.defCount
        };

        // 如果有變化，更新記錄
        if (diff.offPower !== 0 || diff.offCount !== 0 || diff.defPower !== 0 || diff.defCount !== 0) {
            console.log(`[${MONITOR_NAME}] 數據變動:`, diff);
            lastStats = now;
            renderUI(now, diff);
        }
    }

    function renderUI(now, diff) {
        if (!uiPanel) return;
        uiPanel.style.display = 'block';
        
        const content = document.getElementById('rf-monitor-content');
        
        const getDiffHtml = (val) => {
            if (!val) return '';
            const color = val > 0 ? '#00ff00' : '#ff4444';
            const sign = val > 0 ? '+' : '';
            return `<span style="color: ${color}; margin-left: 5px; font-weight: bold;">(${sign}${fmt(val)})</span>`;
        };

        content.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="color: #55aaff; font-weight: bold;">🔵 攻擊方 (Offender)</div>
                <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                    <span>戰力:</span>
                    <span>${fmt(now.offPower)}${getDiffHtml(diff?.offPower)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>人數:</span>
                    <span>${fmt(now.offCount)}${getDiffHtml(diff?.offCount)}</span>
                </div>
            </div>
            <div>
                <div style="color: #ff5555; font-weight: bold;">🔴 防守方 (Defender)</div>
                <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                    <span>戰力:</span>
                    <span>${fmt(now.defPower)}${getDiffHtml(diff?.defPower)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>人數:</span>
                    <span>${fmt(now.defCount)}${getDiffHtml(diff?.defCount)}</span>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #666; text-align: right;">
                最後更新: ${new Date().toLocaleTimeString()}
            </div>
        `;
    }

    // 主循環 - 優化版：僅在偵測到潛在彈窗時才進行 Fiber 掃描
    function startMonitor() {
        createUIPanel();
        
        const check = () => {
            // 優先檢查 URL，若不在戰鬥相關頁面則完全跳過
            if (!location.hash.includes('attack') && !location.hash.includes('battle')) {
                if (uiPanel) uiPanel.style.display = 'none';
                return;
            }

            // 尋找據點戰視窗特徵元素 (AntD Modal 或遊戲自定義 MainBox)
            const modal = document.querySelector('.ant-modal-content, div[class*="mainBox"]');
            if (!modal) {
                if (uiPanel) uiPanel.style.display = 'none';
                lastStats = null;
                return;
            }

            // 只有當彈窗內容看起來像據點戰時才掃描 Fiber (例如包含 "戰鬥中")
            const text = modal.innerText;
            if (text.includes('戰鬥') || text.includes('攻') || text.includes('守')) {
                const battleInfo = getFiberProps(modal);
                if (battleInfo) {
                    updateStats(battleInfo);
                }
            }
        };

        monitorTimer = setInterval(check, 1000); // 頻率降至 1s，據點戰數據不需要 500ms 這麼快
    }

    // 啟動
    if (document.readyState === 'complete') {
        startMonitor();
    } else {
        window.addEventListener('load', startMonitor);
    }

    console.log(`[${MONITOR_NAME}] 已載入，監測據點戰數據變化。`);
})();
