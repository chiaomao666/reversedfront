外掛效能改善 第一階段（P1）  2026-08-18

■ 背景
使用者回報：週日晚上伺服器高峰期常出現連線中斷，以及點擊出戰後卡住；
改用未經修改的版本則順暢。

■ 斷線的機制
main.94fae2cd.js 內的 Phoenix socket：
    this.heartbeatIntervalMs = o.heartbeatIntervalMs || 3e4;      // 30 秒
    this.heartbeatTimer = setTimeout(() => e.heartbeatTimeout(), this.heartbeatIntervalMs);
    heartbeatTimeout() { ... this.abnormalClose("heartbeat timeout") }

送出 heartbeat 後 30 秒內若 JS 沒能執行到回覆處理，客戶端會**自己**把連線關掉。
所以主執行緒被外掛塞住、或記憶體壓力造成 GC 長停頓，都會直接變成斷線。
伺服器高峰只是放大器，真正吃掉這 30 秒預算的是本機負擔。

■ 這次改了什麼

1) index.html 內嵌的 aria-hidden 修正腳本  ← 負擔最大的一支
   舊：observe(document.body, { subtree:true, childList:true, attributes:true })
       callback 對整份文件跑 querySelectorAll，且裡面的 setAttribute 會再產生
       attribute mutation 餵回自己。React 改任何 style/class 都會觸發。
   新：a. attributeFilter:['aria-hidden']，其他屬性完全不進 callback
       b. requestAnimationFrame 合併，同一幀只處理一次
       c. 只處理「變動到的那個節點」，新增子樹也只查那棵子樹，不再重掃全文件
       d. 啟動時補掃一次，涵蓋腳本執行前就存在的節點
   註：這支目前仍寫死在 index.html 裡，無法從小工具管理器關閉。
       外移成獨立工具是第三階段（P3）的項目。

2) pvp_opponent_persist.js  ← 戰鬥中負擔最大的一支
   舊：MutationObserver 每偵測到一個新增元素就排一個 setTimeout，
       每個 timer 又做 4 次 Array.from(document.querySelectorAll("div"))。
       戰鬥動畫一秒新增數百個元素 = 數百個 pending timer 各自掃全 DOM。
   新：a. 全域只用一個 debounce timer，不隨節點數成長
       b. 查詢範圍限縮在戰鬥根容器內，改用前綴選擇器直接命中
       c. 不在戰鬥畫面時完全不排程、不查詢（用快取的根節點判斷）

3) uw_hook.js  ← 記憶體
   舊：每個 >2000 字元的封包無上限存進陣列，且 console.log 印出全文
       （console 會保留字串參照，等於存兩份）。跑幾小時就是數百 MB，
       WebView 記憶體到上限會整個 renderer 被砍掉 = 使用者看到的「連線中斷」。
   新：a. 環形緩衝，上限 50 筆／20MB，超過就丟最舊的
       b. console 只印長度與開頭 200 字
       c. 面板上新增「持續側錄」開關，可隨時暫停
   並在 loader.js 改為 enabled:false（它本來就是診斷工具，要用再打開）。
   ※ 已經在管理器手動開關過 uw_hook 的使用者，localStorage 裡有記錄，
     新的預設值不會覆蓋他們的設定，需要自己再關一次。

4) show_level_cap.js
   舊：每個新增節點對整棵子樹跑 querySelectorAll("div")；
       patchNode 每次都呼叫 getComputedStyle（強制樣式重算）。
   新：改用前綴選擇器 [class*="Actorcard_actorLv_"]；rAF 合併；
       getComputedStyle 只在第一次呼叫。
   ※ characterData 監聽**刻意保留**。React 對單一文字子節點的更新走的是
     firstChild.nodeValue = text（characterData）而不是 childList，
     拿掉的話等級變動時畫面會停在舊值。它的 callback 本身很輕，不是瓶頸。

5) restore_power_display.js
   同 (4) 的前兩項：前綴選擇器 [class*="Actorcard_actorBox__"] + rAF 合併。
   這支會插入覆蓋層，本身也會產生 mutation，合併之後才不會互相放大。

6) custom_attackmap.js
   observer 加上 rAF 合併。applyMarkerTextPatch 會走訪畫面上全部 271 個城鎮標記，
   原本每一批 mutation 都跑一次。

■ 檢查過但不需要改的
city_reward_tracker.js 的 paintDetail() 開頭已經有
「詳細面板不存在就 return」的保護，深層 fiber 走訪只在面板真的開著時才發生，
而且會先用城鎮名反查 store（命中就不走 fiber）。維持原狀。


=====================================================================
第三階段（P3，結構重整）  2026-08-19
=====================================================================

■ 新增 uw_sched.js（CORE）—— 共用 DOM 變動排程器
全站的 MutationObserver 從 8 個降到 1 個。工具改成向它登記回呼：

    UWSched.register({
        id, anchor, pauseInBattle, attrs, text,
        onNodes(added), onRemoved(removed), onAttr(changes), onText(parent), onFrame()
    });

四項機制：
  1. 只走訪一次 MutationRecord，把新增／移除／屬性變動抽出來，不再每支工具各走一遍
  2. requestAnimationFrame 合併，每幀最多派發一次
  3. anchor 閘門：畫面上沒有該工具要處理的東西時整支跳過（省最多的就是這個）
  4. pauseInBattle：PVP 戰鬥期間暫停非必要工具

除錯用：
    UWSched.list()          目前登記了哪些工具與各自的 anchor
    UWSched.currentPage()   目前掛在畫面上的頁面名稱
    UWSched.inBattle()      現在是不是在 PVP 戰鬥畫面

出問題時的退路：把 uw_sched.js 開頭的 PASSTHROUGH 改成 true，
每支工具會退回自己一個 observer（行為與改寫前相同），可用來確認問題是不是排程器造成的。

■ 沒有做 rf_page.js
原計畫要另外做一支頁面感知模組（用 <頁面名>_rootContainer__<hash> 判斷）。
實作時發現 anchor 閘門已經涵蓋同樣的需求，而且更精準 —— 與其問「現在在哪一頁」，
不如直接問「畫面上有沒有我要處理的東西」。多一支模組只是多一層要維護的東西，
所以只在 uw_sched 裡留了 UWSched.currentPage() 當除錯用的小工具。

■ index.html 的 aria-hidden 腳本已外移
變成 fix_aria_hidden.js，登記在 TOOLS 裡（預設開啟，可從管理器關掉排查）。
index.html 現在只剩兩支 script 標籤，body 裡沒有任何內嵌邏輯。
備份：index_20260819.html

■ 各工具的 anchor 設定
    fix_aria_hidden        無（全站適用，只申請 aria-hidden 這一個屬性）
    custom_attackmap       [class*="Attackmap_rootContainer__"]        + pauseInBattle
    show_level_cap         [class*="Actorcard_actorBox__"]
    restore_power_display  [class*="Actorcard_actorBox__"]
    pvp_opponent_persist   無（刻意，見下）
    city_reward_tracker    [class*="PortalMap_marker"], [class*="Attackmap_cityDataBox__"]  + pauseInBattle
    rf_account_manager     [class*="Login_loginFormBox__"]

pvp_opponent_persist 刻意不設 anchor：它的判斷依據就是戰鬥根容器，
若拿根容器當 anchor，戰鬥結束、根容器消失的那一幀會被閘門擋掉，常駐面板就永遠收不掉。
改成由 onRemoved 負責收尾（onRemoved 不受 anchor 與戰鬥閘門影響）。
這是設計上的一個陷阱，改這裡之前先想清楚「消失時誰來清理」。

show_level_cap 與 restore_power_display 沒有設 pauseInBattle：
戰鬥畫面也會出現角色卡片，暫停的話等級上限與戰力會在戰鬥中消失。
如果實測發現戰鬥期間還是卡，可以把這兩支改成 pauseInBattle: true，
代價是戰鬥畫面的卡片少了那兩個數字。

■ rf_store.js 新增 findData()
show_level_cap.js 與 restore_power_display.js 原本各帶一份幾乎一樣的 findActorData
（CLAUDE.md 也標註「兩份要保持同步」），現在抽到 RFStore.findData 共用：

    RFStore.findData(elOrFiber, predicate, { maxHops: 20, hooks: false, hookHops: 6 })

show_level_cap 傳 hooks: true（它需要連 hook state 一起掃），restore_power_display 不用。
RFStore.version 由 1 升到 2。

■ 沒有做：重新壓縮 bundle 與 CSS
本機沒有 terser / uglifyjs / esbuild / cleancss，而且這份 bundle 是手改過的
（不只多了 RFAudio 兩個 hook，還移除了等級上限與戰力的渲染），
沒辦法用 _ori 加上 hook 機械式重建。在沒有壓縮工具、也沒辦法立刻在瀏覽器驗證的情況下
盲壓 7.8MB 的手改檔風險太高，所以沒有動。
現況：JS 7.80MB（原版 4.31MB）、CSS 1.10MB（原版 0.90MB），
去掉空白後內容幾乎相同，多出來的全是縮排換行。
建議改用伺服器端 gzip（風險最低，效果一樣），或另外找一台有 node 工具鏈的機器處理。

■ P3 之後的觀察指標
Console 啟動時應該看到：
    [SCHED] 共用 DOM 變動排程器已載入
    [SCHED] 已登記：fix_aria_hidden
    [SCHED] 已登記：custom_attackmap（anchor: ...）
    ...每支工具各一行
在 Console 打 UWSched.list() 可以確認全部都登記上了。

■ P3 備份
index_20260819.html
loader_20260819.js
rf_store_20260819.js
custom_attackmap_20260819.js
show_level_cap_20260819.js
restore_power_display_20260819.js
pvp_opponent_persist_20260819.js
city_reward_tracker_20260819.js
rf_account_manager_20260819.js

■ 已知的既有問題（與本次改動無關）
node city_reward_tracker.test.js 目前是 15 通過 / 11 失敗。
用改動前的備份（city_reward_tracker_20260819.js）跑同一份測試結果完全相同，
所以不是這次改動造成的。原因是測試資料
C:/code/rf_site/return_data_example/cities.json 的格式與內容換過了
（從 Phoenix 原始 frame 陣列變成 { cities: [...] }，資料本身也不同）。
本次只把測試的讀取那一行改成兩種格式都吃，讓它至少跑得起來；
失敗的 11 個案例是資料對不上，需要另外處理。

■ 驗證方式
載入頁面後觀察 Console 的各支 [TAG] 啟動訊息是否齊全，然後：
- DevTools Performance 錄製 30 秒 PVP 戰鬥，比較主執行緒 scripting 時間
- Performance monitor 看 JS heap 是否還會單調上升
- 週日高峰連續遊玩，記錄斷線次數

■ 備份
index_20260818.html
loader_20260818.js
pvp_opponent_persist_20260818.js
uw_hook_20260818.js
show_level_cap_20260818.js
restore_power_display_20260818.js
custom_attackmap_20260818.js

點擊感應區（雙刀出戰卡住）的處理請閱讀 README_MARKER_HITBOX.txt。
