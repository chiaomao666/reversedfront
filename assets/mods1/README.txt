RF 修正版檔案配置                                    最後更新 2026-08-19

■ 目錄結構
所有手寫的 mod 檔案與文件都集中在 assets/mod/ 底下（2026-08-19 整理）。
assets 根目錄只留遊戲本體與 index.html。

    assets/
      index.html                 ← 只掛兩支 script：./mod/loader.js 與主程式
      static/js/main.94fae2cd.js ← 被改過的主程式（原版是 main.94fae2cd_ori.js）
      static/css/main.f4ae5b14.css ← 被改過的樣式（原版是 main.f4ae5b14_ori.css）
      mod/
        loader.js                ← 唯一的進入點，其他工具都由它載入
        uw_panel.js / .css       ← CORE：浮動視窗外殼
        rf_store.js              ← CORE：遊戲 React context store 存取
        uw_sched.js              ← CORE：共用 DOM 變動排程器
        fix_aria_hidden.js       ← 工具（原本內嵌在 index.html）
        custom_attackmap.js/.css
        uw_hook.js               ← 診斷工具，預設關閉
        show_level_cap.js
        restore_power_display.js
        pvp_opponent_persist.js
        city_reward_tracker.js/.css/.test.js
        rf_audio_panel.js
        rf_mod.js / .css         ← 預設關閉（只剩 reduce-motion 與戰鬥分數樣式）
        rf_account_manager.js/.css
        audio_panel_test.html    ← 手動測試頁
        city_detail.png          ← 城鎮詳細面板的參考截圖
        README*.txt              ← 全部文件
        backup/                  ← 所有 _yyyymmdd 日期備份

■ 部署
把上述相對路徑原樣複製到主機即可。index.html 必須留在根目錄。

mod/ 資料夾可以整包改名或搬到別的位置 —— loader.js 會用
document.currentScript 取自己的所在目錄當基準來解析其他工具的路徑，
只要同步改掉 index.html 裡那一行 src="./mod/loader.js" 就好。

mod/backup/ 只是歷史備份，部署時不需要一起放上去。

■ 新增一支工具
只要在 loader.js 的 TOOLS 陣列加一筆（id / src / css / enabled），
檔案放進 mod/ 即可，其他地方都不需要改。
路徑一律寫成 "./xxx.js"（相對於 mod/ 資料夾）。

■ 設定
- loader.js 的 SHOW_PANELS（預設 false）：浮動視窗總開關。
  false = 完全不建立任何面板（小工具管理器、音量控制、獎勵追蹤、側錄面板都不出現），
  工具本身照常運作 —— 音量設定、獎勵標示、等級上限這些功能都不受影響。
  關掉之後畫面上就沒有管理器可以勾選工具，要臨時打開請在 Console 執行：
      UWPanel.setVisible(true)    再重新整理頁面
      UWPanel.setVisible(null)    清掉臨時設定，回到 loader.js 的預設值
      UWPanel.isVisible()         查目前狀態
  臨時設定存在 localStorage 的 uw_panels_visible，優先於 SHOW_PANELS。
- rf_account_manager.js 的 ROWS_MAX（預設 6）：帳號清單每頁的「列數」上限。
  每頁筆數 = 可容納列數 × 欄數，會依當前視窗高度在掛載時與 resize 時重算。
  欄數來自 rf_account_manager.css 的 .rf-account-list（2 欄，760px 以下 1 欄），
  JS 用 getComputedStyle 實際讀出來，所以改 CSS 的欄數不必同步改 JS。
- rf_mod.js 的 reduceMotion=true：套用 rf_mod.css 的減少動畫規則（此工具預設關閉）
- 每支工具的開關存在 localStorage 的 uw_loader_config，
  畫面左側「[小工具管理器]」面板可即時勾選，改完需重新整理頁面。
- 瀏覽器 Console 可用：
    RFMod.setReduceMotion(false)
    RFMod.setMuteButtonSound(true)     （實際是轉呼叫 RFAudio 的 effects 靜音）
    RFAudio.getState()                 音量設定
    RFStore.getCities()                遊戲城鎮資料
    RFReward.getState()                獎勵領取追蹤狀態
    UWSched.list()                     目前登記在排程器上的工具
    UWPanel.setVisible(true/false/null) 浮動視窗總開關（重新整理後生效）

■ 注意
rf_account_manager.js 為了保留原功能，仍會將密碼存入瀏覽器 localStorage。
這不等同安全的密碼保管庫；請只在可信任的個人裝置使用。

■ 其他文件
README_AUDIO_VOLUME.txt                 音量控制
README_BGM_FIX.txt                      背景音樂修正
README_CITY_RESTORE_ORIGINAL_PLAYMUSIC.txt  城鎮顯示與原始 playMusic
README_SELECTIVE_ANIMATION.txt          哪些動畫必須保留
README_CITY_REWARD_TRACKER.txt          未領取獎勵追蹤
README_PERFORMANCE.txt                  外掛效能改善（2026-08-18／19）
README_MARKER_HITBOX.txt                攻擊地圖點擊範圍、雙刀位置與名稱
