RF 選擇性動畫控制修正版
========================

本版修正 rf_mod.css 中過度廣泛的 reduce-motion 規則。

主要變更
--------
1. 移除下列全域規則：
   html.rf-reduce-motion *
   html.rf-reduce-motion *::before
   html.rf-reduce-motion *::after

2. 因此恢復並保留下列原生動畫：
   - 每日登入獎勵跳出動畫
   - 視窗／Modal 進入與離開動畫
   - 右上角選單展開與收合的滑動動畫
   - Ant Design fade、slide、zoom、collapse 動畫
   - 其他未曾特別修改的遊戲 UI 動畫

3. reduceMotion=true 現在只停用先前明確處理過的項目：
   - 首頁六個齒輪／導航圖示的 spring transform
   - 教學畫面 Demos_clickSensorImg__jeie+ 的 highlight circle 效果
   - Character_spritesheet__1Y1GJ
   - Character_spritesheet__xFZcG
   - 對應的兩層 Character spritesheet effect

4. 角色布局 class 不受影響：
   - Character_spritesheetsBox__D2x6F
   - Character_spritesheetBox__8KTij
   - Character_spritesheetBox__e+5e4
   - Character_flipbox__pI-AT
   - BattleStage_charactersCol__08Irq

部署方式
--------
完整包可直接覆蓋上一版。實際必要更新只有 rf_mod.css；其餘檔案一併提供，方便整包部署。

控制方式
--------
RFMod.setReduceMotion(true);  // 僅停用上述指定動畫
RFMod.setReduceMotion(false); // 恢復上述指定動畫

■ 補充（2026-08-19）
rf_mod.css 裡的 .rf-account-* 帳號面板樣式已抽到 rf_account_manager.css，
本文件描述的 reduce-motion 規則不受影響，仍然在 rf_mod.css 裡。

■ 補充（2026-09-05）：齒輪停轉沒有生效
原因：mods/loader.js 的 TOOLS 清單裡 rf_mod 被標成 enabled:false
（註解寫「目前沒用處」）。rf_mod 關閉時 loader 不會注入 rf_mod.css，
rf_mod.js 也不會執行，html 上就不會有 rf-reduce-motion class，
本文件描述的所有規則等於全部失效，首頁齒輪照常轉。

處理：把 rf_mod 改為 enabled:true。

localStorage 舊記錄：uw_loader_config 若已存過 {"rf_mod":false}，它的優先權
高於清單裡的預設值，只改 loader.js 對那些瀏覽器沒用。因此 loader.js 加了一次性
清理（runMigrations / MIGRATIONS）：下次載入頁面時會把那一筆 rf_mod 刪掉，
其他工具的設定保留，並在 localStorage["uw_loader_migrations"] 記下已套用的項目，
之後使用者自己在「[小工具管理器]」關掉 rf_mod 不會再被蓋回去。
console 會出現「[LOADER] 清理舊設定：rf_mod（20260905_drop_rf_mod_flag）」。

驗證：首頁齒輪由 react-spring 以 rotate 迴圈寫成 inline style
（v3.0 bundle：H={loop:true,from:{rotate:0},to:{rotate:360}}，套在
Home_gearImg__Oz5h1 上）。inline style 沒有 !important，所以
rf_mod.css 的 transform:none !important 仍然壓得過去，class 名稱在
v3.0 的 main.d3867357.js / main.f870afe0.css 中也未改變。

■ 補充（2026-09-05）：PortalMap 與 HQ 光圈停轉
新增停用的項目（rf_mod.css）：
  [class*="PortalMap_sRing__"] .rotation_highlightCircle
      → PortalMap 上九座 HQ 城市外圈的旋轉光圈
  [class*="Attackmap_animatedRing__"] .rotation_highlightCircle
      → 攻城地圖上 capital 標記外圈的旋轉光圈（Leaflet divIcon 內）

這兩處用的是遊戲共用的 .rotation_highlightCircle
（@keyframes global_rotation__QhPc4，3.6s linear infinite）。
該 class 同時還用在：載入畫面、每日獎勵跳出、通行證領取、大臣任命、
教學點擊提示、PVP 隊伍確認鍵。所以規則只往這兩個容器底下收斂，
不要直接停掉 .rotation_highlightCircle 本身，否則會一併停掉上面那些。

容器 class 用 [class*=] 前綴比對，不寫死 hash 尾碼
（v3.0 目前是 PortalMap_sRing__-l+dE、Attackmap_animatedRing__TViqr；
前者含 "+"，寫死的話 CSS 還要跳脫成 \+）。
