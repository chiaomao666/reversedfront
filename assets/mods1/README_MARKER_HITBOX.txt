攻擊地圖城鎮點擊範圍（markerClickSensor）  2026-08-18

■ 症狀
點城鎮常常沒反應，右側詳細面板停在前一座城；有雙刀（進行中戰鬥）的城特別難點中。
使用者原本的回報是「點擊雙刀出戰卡住」。

■ 真正的原因：可點範圍遠小於看到的圖示

Leaflet 的 DivIcon 預設 iconSize 是 [12, 12]：
    var ko = Fn.extend({ options: { iconSize: [12, 12], html: !1, ..., className: "leaflet-div-icon" } })
而遊戲建立 marker 時呼叫的是 divIcon({ html: ... })，**沒有傳 iconSize**，
所以 .leaflet-marker-icon 就是 12×12 px。

標記的 DOM 結構：
    div.leaflet-marker-icon                                   12×12 px（Leaflet 寫死）
      └ div.Attackmap_markerCityBox__9SxDr .iMarkerScaleLevel  position:relative ← 感應區的百分比基準
          ├ div.Attackmap_markerCityBox_inline__UR8KZ          看得到的圖示，pointer-events:none
          │     ├ div.markerCityIcon（4 張 img）
          │     └ div.markerCityName（城名，或 sword 時的雙刀 img）
          └ div[data-sensor-city-id].Attackmap_markerClickSensor__VAWI1   ← 唯一可點的東西

關鍵：整個標記只有 clickSensor 收得到點擊。
上面那個 inline 盒子帶著 pointer-events:none，所以「看得到的圖示」完全不可點。

而舊的覆寫把 markerCityBox 從官方的 calc(min(57vw,100vh)*.125) 改成 100%×100%，
也就是縮成 Leaflet 那個 12px。感應區的 300% 是相對於這個盒子算的：

    以 1600×900 畫面（min(57vw,100vh) = 900px）為例
        官方原版      盒子 112px → 感應區 100% = 112px
        舊覆寫        盒子  12px → 感應區 300% =  36px    ← 比官方還小 3 倍
        看到的圖示    markerCityBox_inline    = 225px     ← 不可點

所以註解寫的「擴大 3 倍點擊範圍」其實不是放大，是在補償盒子被縮小 9 倍，
而且補得不夠。使用者看到 225px 的城鎮圖示，實際只有正中央 36px 可點，
點偏了就穿透到地圖、marker click 根本不觸發，右側面板自然停在前一座城。

遊戲的 marker click 處理讓這件事看起來更像「卡住」：
    click: function (e) { var o = e.originalEvent.target?.dataset?.sensorCityId; ce(0, o) }
    ce = function (t, n) {
        if (n == e.selectedCity.id) { M.setView(...) }      <- 只置中，不發事件
        else e.callback({ event: "click,marker", id: n })
    }
拿不到 sensorCityId 就沒有任何反應，畫面完全不動。

■ 關鍵：markerCityBox 同時是「視覺」和「命中範圍」的基準
    - 白色小方框     = markerCityBox 自己的 background-color + border
    - 圖示與雙刀位置 = markerCityBox_inline 以 50%/50% 對齊 markerCityBox 的中心
    - 命中範圍       = markerClickSensor 的百分比，基準也是 markerCityBox
動其中一個尺寸，另外兩個都會跟著跑。這是這裡最容易踩到的地方。

■ 最終處理（只動工具層 custom_attackmap.css，把視覺和命中範圍拆開）

  1) markerCityBox 完全維持原樣，一個字都不動
     （12px、白底黑框、top:50%/left:25% 位移都保留）
     → 白色小方框、雙刀位置、圖示位置全部跟以前一模一樣

  2) 感應區改成不用百分比，直接寫官方的絕對尺寸，並對齊盒子中心：
        .Attackmap_markerClickSensor__VAWI1 {
            height / width: calc(min(57vw,100vh)*.125)   官方值
            left / top: 50%
            transform: translate(-50%, -50%)
            position: absolute
        }
     → 命中範圍 = 官方的 112px，會跟著視窗大小走，完全不受 markerCityBox 尺寸影響

  結果：custom_attackmap.css 相對於最初的原始檔，只有感應區這一條規則不同，
  其餘（含所有視覺覆寫）完全一致。

刻意**不動** static/css/main.f4ae5b14.css：這些覆寫留在工具層，
只有在小工具管理器開啟 custom_attackmap 時才套用。

■ 雙刀圖示定位（2026-08-19 一併處理）
舊寫法 top: -100% 其實完全沒有作用：
  這條規則把雙刀設成 position:absolute 之後，父層 markerCityName 就沒有任何
  in-flow 子元素，高度塌成 0；而 top 的百分比是相對於父層高度算的，
  -100% × 0 = 0。結果雙刀停在城名那一行，也就是方框中心下方約 M*.1
  （900px 畫面約 90px），看起來就是「跑掉了」。
  這個狀況在效能改善之前就存在，不是這次改動造成的。

改成用視窗單位直接算，而且用 bottom 而不是 top。以 M = min(57vw,100vh)：
    城名那一行的下緣在方框中心下方     +M*.100    （inline 盒子半高 .125 − bottom:10% 的 .025）
    雙刀自己的高度                      M*.0625
    雙刀下緣要落在方框中心下方          +M*.03125 （雙刀半高，這樣中心才會對齊）
    合計 bottom = M*(0.100 − 0.03125) = M*0.06875

【為什麼一定要用 bottom，不能用 top】
  下面「有雙刀時補回城鎮名稱」那段會把名稱塞回 markerCityName，
  父層高度會從 0 變成一行文字的高度。父層的上緣會因此往上移，
  但下緣被 bottom:10% 釘住不動。
  用 top 定位的話，補上名稱之後雙刀會整個往上跳；用 bottom 就完全不受影響。
  （第一次改這裡時用的是 top，補名稱之後就會出問題，所以改掉了。）

微調只要改那個 0.06875：
    數字變大（例如 0.10）→ 雙刀往上跑
    數字變小（例如 0.04）→ 雙刀往下跑
    0.09375 會讓雙刀底邊剛好落在方框頂邊（不遮住方框）
水平方向本來就是置中的，不需要動。

目前設定是「雙刀置中疊在白色方框上」（使用者選定）。雙刀約 M*.0625、方框只有 12px，
所以方框會被雙刀完全蓋住 —— 這是預期行為，不是 bug。


■ 有雙刀時補回城鎮名稱（2026-08-19，實作在 custom_attackmap.js）
bundle 裡是二選一：
    rd.jsx("div", { className: WB, children: t.sword ? rd.jsx("img", {className: wB, src: fw}) : t.name })
有雙刀的時候城鎮名稱**根本沒有進 DOM**，純 CSS 救不回來，只能從外面補。

做法（custom_attackmap.js 的 ensureSwordCityName）：
  1. 在 applyMarkerTextPatch 走訪 markerCityName 時，順便看裡面有沒有雙刀 img
  2. 有的話，往上找 markerCityBox，再從裡面的 [data-sensor-city-id] 拿城鎮 id
     —— 這是 bundle 自己放的屬性，也是 marker 點擊處理用的同一個來源
  3. 用 RFStore.getCities() 建 id→名稱 的索引（只建一次，快取起來），查出名字
  4. 在 markerCityName 內附加一個 <span data-uw-sword-label="1">城鎮名</span>

重點：
  - attackmap 的 marker 是 divIcon 的靜態 HTML（renderToString 之後交給 Leaflet），
    上面**沒有 React fiber**，所以不能用 fiber 查資料，只能靠 data-sensor-city-id。
    （PortalMap 的 marker 才有 fiber.key，兩邊機制不同，不要混用。）
  - 每個名稱容器處理成功後蓋章 data-uw-sword-checked="1"，之後不再重複查詢；
    marker 重繪時 Leaflet 會整個換掉 DOM 節點，新節點沒有章，自然會重跑。
  - store 還沒準備好時不蓋章，下一輪會再試，並且有 1 秒的冷卻避免狂查。
  - 名稱是 in-flow 文字，會出現在城名原本的位置（方框中心下方約 M*.1），
    雙刀則是 absolute 浮在方框中心，兩者不會重疊。

■ 不要再做的事
- 不要為了調整命中範圍去改 markerCityBox 的尺寸。那會連帶動到白色小方框與雙刀位置。
  要調命中範圍請只改感應區 calc() 的係數（.125 是官方值）。
- 不要把感應區改回百分比。百分比的基準是那個被縮到 12px 的盒子，沒有直覺意義，
  而且會隨著盒子被改動而失效。
- 不要把係數放大太多。官方的 .125 已經是不會讓相鄰城鎮重疊的上限，
  再大會變成點 A 城卻選到 B 城（若選到的剛好是目前已選取那座，
  就會走上面 ce() 的 setView 分支，完全沒反應）。

■ 過程紀錄（避免重蹈覆轍）
第一版：誤判成「感應區 300% 太大造成重疊」，把它降到 150%。
        結果可點範圍從 36px 再砍到 18px，症狀更嚴重，使用者立即回報點不動。
        全部還原後才量出真正的幾何（Leaflet iconSize [12,12] 那一段）。
第二版：把 markerCityBox 還原成官方的 112px、感應區用 100%。
        點擊修好了，但白色小方框消失、雙刀位置跑掉 ——
        因為視覺與命中範圍綁在同一個盒子上。
第三版（目前）：視覺完全不動，只把感應區改成絕對尺寸。兩邊都對。

教訓：
  1. 改這裡之前先確認 markerCityBox 的實際像素尺寸（它是 12px，不是看起來的大小）。
  2. 視覺與命中範圍共用同一個基準時，不要試圖用同一個數字同時滿足兩者，拆開處理。

■ 備份
custom_attackmap_20260818.css          （最初的原始狀態；視覺部分與現在完全相同）
static/css/main.f4ae5b14_20260818.css  （未動，僅留存）

要完全回到最初狀態：直接把 custom_attackmap_20260818.css 蓋回 custom_attackmap.css，
代價是命中範圍回到 36px（點擊會再次不靈）。

■ 待驗證
開啟 attack map，確認：
  1. 城鎮中央沒有白色方塊
  2. 標記圖示位置與原本相同（盒子位移移除後只差幾 px）
  3. 點城鎮能正確切換右側面板，包含有雙刀的城
  4. 不會點 A 城卻選到 B 城
