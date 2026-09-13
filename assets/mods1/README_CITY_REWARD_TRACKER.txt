RF 未領取獎勵追蹤 + 浮動視窗側邊收納
======================================
2026-08-16

新增檔案
--------
uw_panel.js / uw_panel.css          浮動視窗共用外殼（基礎模組）
rf_store.js                         遊戲 React store 存取（基礎模組）
city_reward_tracker.js / .css       未領取獎勵追蹤

修改檔案
--------
loader.js                           修載入順序、新增 CORE 清單、面板改用共用外殼
uw_hook.js                          面板改用共用外殼
rf_audio_panel.js                   面板改用共用外殼，並正式掛進 TOOLS

備份：loader_20260816.js / uw_hook_20260816.js / rf_audio_panel_20260816.js


一、loader 載入順序修正
-----------------------
動態建立的 <script> 預設就是 async，defer 對它無效，所以原本七支工具是
「誰先下載完誰先執行」。要照插入順序執行必須明確設 async = false。

以前每支工具都自給自足所以看不出問題，但引入 uw_panel / rf_store 這類共用
模組之後就會隨機失敗，因此一併修掉。

loader 現在分兩份清單：
  CORE   共用基礎模組，一律載入，管理面板上顯示為 [core] 且不可勾選
  TOOLS  各功能工具，可在管理面板開關（改動後重新整理才生效）


二、浮動視窗三段收納
--------------------
所有面板改由 uw_panel.js 統一提供外殼，狀態如下：

  展開 ──點 —──▶ 收合(只剩標題列) ──點標題列──▶ 貼邊(直書標籤)
    ▲                                              │
    └───────────────── 點標籤 ◀────────────────────┘

貼邊時整個視窗滑出畫面外，只在螢幕邊緣留一條約 24px 的直書標籤，不會擋到
遊戲主畫面。同一側的多個標籤會沿著邊緣往下堆疊，不互相遮蔽。

標題列可拖曳；位移小於 4px 視為點擊（才會觸發收到側邊）。
狀態與位置保存在 localStorage 的 uw_panel_state_v1，各面板獨立。

原本 rf_audio_panel 疊在 uw_hook 面板上方的 uw-panel-moved 事件已移除，
改由共用外殼各自定位。


三、rf_audio_panel 正式掛載
---------------------------
rf_audio_panel.js 之前沒有寫進 loader 的 TOOLS，所以 window.RFAudio 一直是
undefined，main.94fae2cd.js 裡這兩個掛勾等於空轉：

    window.RFAudio && window.RFAudio.prepare(o, t)
    if (!e || window.RFAudio && !window.RFAudio.shouldPlay(e))

本版把它加進 TOOLS，音量控制才會真的生效。
音訊設定沿用原本的 rfAudioSettingsV1；面板位置改存進 uw_panel_state_v1，
舊的 rfAudioPanelPositionV1 不再使用。


四、未領取獎勵追蹤
------------------
判定條件抄自遊戲自己的一鍵領取按鈕：

    filter(cities, { reward: true, reward_collected: false })

reward=true 代表這座城鎮因為大臣職位／控制聯盟而有可領的援助，
送出時的 reference_type 是 "Minister and Control Union"。

額外排除（設定在 city_reward_tracker.js 最上方）：
  - 各陣營 HQ（hq 或 capital 為真）
    自國 HQ 的 hq_word 是「中央援助」，走另一個領取入口；遊戲的城鎮詳細
    本來也是先判 capital 再判 reward，HQ 永遠不會顯示地方援助。
  - 世界之塔：以 map_building 含 cathayan_tower 辨識，比寫死 id 穩。
  - EXCLUDE_CITY_IDS = [589]  卡加布列島（番外篇、無陣營，與世界之塔同類）

顯示位置：
  1. PortalMap
     marker 本體只有 min(57vw,100vh)*.00813（1600px 高時約 13px），
     所有圈圈都是 ::after 且 pointer-events:none，不會擋掉原本的點擊。
     城鎮 id 從 marker 的 React key 取得（格式 "<city_id>,<0|1>"）。

       未領取           金色呼吸光圈（340%，搶眼）
       今日已領・持有   暗綠實線細圈（250%，靜態）
       今日已領・失守   暗綠虛線細圈（250%，靜態）

  2. 城鎮詳細（attackmap 右欄）
     仍在獎勵清單內：在最後一列「佔領者（控制聯盟）」後面補上
     （已領取）／（未領取）。這一列的內容是 dangerouslySetInnerHTML 的
     <span>，改它的內容會被 React 洗掉，所以是在該列後面另外補一個 span。

     已失守但今日領過：那一列顯示的是對方聯盟名稱，標在那裡會讀成
     「對方領了」，所以改標在城鎮名（Attackmap_cityName__）旁邊，
     文案也改成（今日已領），主詞落在「今日」而不是聯盟。

     HQ 維持原本的「中央援助」不動，不加任何標註。

  3. 浮動面板 [獎勵] 未領取追蹤
     顯示「未領取 N / 可領 M」與「今日已領 K（含失守 J）」，
     並提供未領取／已領兩種標示的獨立開關。
     開關狀態存在 localStorage 的 uw_reward_tracker_v1。


五、當日帳本（處理「已失守但今天領過」）
----------------------------------------
「今天領過」這個資訊在前端只存在於城鎮自己的 reward_collected 欄位，而該
欄位只跟著 reward=true 的城鎮走。整包 bundle 翻過，沒有第二個來源：
collect_bundle 的回應只帶 reference_type 與獎勵道具、Ministers 頁面吃的是
單一城鎮 props、store 裡也沒有任何已領歷史陣列。

所以城鎮一旦離開獎勵清單（例如聯盟失去控制），那筆資訊就從資料中消失。
本版自己記一本當日帳補這個洞：

  localStorage key: uw_reward_journal_v1
  內容: { epochStartedAt: 毫秒, collected: { "<city_id>": "城鎮名" } }

顯示優先權（live 資料一律優先，帳本只補 live 沒有的）：

  reward=true, collected=false   live  →  未領取（金色光圈）
  reward=true, collected=true    live  →  已領取
  不在獎勵清單，但帳本有         帳本  →  已領取・失守

這個順序很重要：城鎮被搶回且伺服器允許再領一次時，live 的 collected=false
會蓋掉舊紀錄，光圈正確亮起，不會被過期的帳本誤導。

跨日重置的判斷不靠猜伺服器時刻：
  reward=true 的城鎮，reward_collected 由 true 翻回 false → 判定為重置。
  一天之內領過就不會變回未領，所以這個訊號很乾淨。

  但重置有可能是一座一座增量推過來的（bundle 裡的 update_data 走的就是
  依 id 合併的增量路徑）。第一座翻回未領時就清帳，此時還沒收到更新的城鎮
  仍然是 collected=true，照常記帳就會把舊資料原封不動寫回新的一天。
  因此重置後有 15 秒緩衝期，期間只認「由未領翻成已領」的真實領取動作。

  重置當下手上剛好一座獎勵城鎮都沒有時沒有訊號可看，另外用 26 小時的
  期限兜底。

侷限（補不掉，使用前要知道）：
  1. 遊戲沒開就記不到。在別的裝置領取、或領完後到重開頁面之間城鎮就易主，
     那筆會漏。實務上領取動作都發生在這個 client，當下頁面必然開著。
  2. 啟用當天不準，之前的紀錄不存在。
  3. 本機資料，換瀏覽器／清快取就沒了。
  4. 帳本只知道「我看到它被領過」，不知道「沒看到的城鎮今天能不能領」。
     所以失守城鎮只會有「已領取」，不會有「未領取」——那筆資訊本來就不在。


Console API
-----------
  RFReward.getState()      目前的三組清單與可領總數
  RFReward.getJournal()    當日帳本內容
  RFReward.resetJournal()  手動清帳（帳本被誤判污染時用）
  RFReward.ingest(cities)  餵一份 cities 跑一輪，測試與除錯用


效能
----
沿用 custom_attackmap.js 的原則：
  - 資料變動偵測用 1 秒輪詢（rf_store.js 的 subscribe），只讀 store，
    不做任何 getBoundingClientRect。
  - 待領城鎮清單的 signature 沒變就不重畫。
  - MutationObserver 只監聽 childList，並用 requestAnimationFrame 合併同一幀
    內的大量 mutation。
  - uw_panel 的標籤堆疊需要量測高度，只在狀態切換與視窗大小改變時執行。


驗證狀態
--------
city_reward_tracker.test.js 會在最小 DOM stub 下實際執行 city_reward_tracker.js，
透過它自己的 RFReward.ingest() 驅動情境測試（測的是真的那份程式碼，不是另外
重寫一份）。用實際的 cities 側錄資料當基底，共 26 項全數通過：

    node city_reward_tracker.test.js

涵蓋：
  - 排除規則（HQ / 世界之塔 / 卡加布列島，即使強制設成已領也不進帳本）
  - 城鎮失守後仍記得今天領過
  - 城鎮搶回且可再領時 live 蓋過帳本
  - 每日重置清帳
  - 重置緩衝期不把舊值寫回新的一天
  - 緩衝期內的真實領取仍會記錄
  - 帳本超過 26 小時作廢

這支測試不會被 loader.js 載入，只是開發用；不需要的話可以直接刪掉。

尚未驗證：光圈與詳細頁標註的實際外觀要在畫面上看才知道。目前手上的側錄資料
未領取數為 0、失守數為 0，所以金色光圈與「（今日已領）」都還沒在真實資料下
出現過。
