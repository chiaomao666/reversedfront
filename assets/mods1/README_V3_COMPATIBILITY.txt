v3.0 相容性調整（2026-09-05）
================================

使用方式
將 v3.0 的 js/、css/、media/ 放到 static/，再從 assets/ 提供 HTTP
服務並開啟 index.html。首頁使用 static/css/main.f870afe0.css
與 static/js/main.d3867357.js，mods/ 路徑不變。
搬移由使用者進行；在 v3.0 檔案就位前，新版入口尚不可用。
mods/loader.js 先載入原有工具，再依 data-main 啟動遊戲。
既有工具開關與 localStorage 設定沿用。

修正
1. 等級上限：保留 v3.0 FitText 的 DOM，只修改其文字節點；
   接收內層文字更新，避免移除 React 子元件或升級後不再補上限。
2. 音量：v3.0 會等待音效 ended；靜音效果音、語音改以音量 0
   正常播放，保留完成事件。仍會下載音訊。循環 BGM 靜音時暫停。
   本次沒有新增舊版 bundle 的 shouldPlay 跳過下載補丁。
3. 載入順序：遊戲排在工具之後，確保攔截先安裝。
4. 使用官方 bundle 原有的 static/media 與 static/js 路徑。
   不再產生 main.mod.js，不需要建置或改寫 bundle。
   官方 main.d3867357.js、CSS 與 source map 保持原樣。

核對結果
v3.0 原始碼映射顯示：既有 CSS class 名稱、登入表單、cities/setCities、
reward/reward_collected、角色資料及攻城地圖 sensor-city-id 仍相容。
因此不需要重寫攻城地圖或動畫樣式。

驗證（assets/ 目錄）
  node mods/v3_compat.test.cjs
  node mods/city_reward_tracker.test.js
相容性測試涵蓋 JS 語法、靜態資源路徑、資料契約、FitText 文字更新、
靜音音效原生播放與 BGM 暫停、工具載入順序。獎勵情境 26 項通過。
獎勵測試已改用固定合成資料，不再依賴外部帳號快照。
相容性測試優先讀取正式 static/；尚未搬移時讀取 static/v3.0/ 暫存包。

限制
目前沒有可連接的瀏覽器，尚未完成實際登入、攻城、PVP 與 APK/WebView
實機驗證。自動測試通過不代表已驗證完整線上遊戲流程。
此資料夾只提供 v3.0 Web 資源；未修改 Android 原生程式或裝置版本回報。

回復
原首頁與本次修改的工具備份在 mods/backup/*_pre_v3_20260905.*。
要切回舊版入口，將 index_pre_v3_20260905.html 複製回 assets/index.html。
舊版 static/js 與 static/css 未修改。mod.zip 是舊封裝，本次未更新；
部署請使用目前 index.html、mods/、搬移完成的 static/，並保留 passionfruit 等資源。
