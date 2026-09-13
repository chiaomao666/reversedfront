RF 城鎮顯示還原 + 原始 playMusic 版本
=========================================

本版以 rf_bgm_fix 為基底。

城鎮顯示還原：
- 恢復 cities/building/、cities/sovereign/ 資源載入。
- 恢復 map_building_frame、map_control、map_sovereign、map_building 四層地圖圖示。
- 恢復 sword 與城鎮名稱二選一。
- 恢復 sovereign/control 旗幟原始排列。
- 恢復 nation_battle_score 純數字顯示。
- 恢復倒數 hours:minutes:seconds。
- 移除 disableIconChange 自訂分支。

playMusic 依 main.94fae2cd_ori.js：
- 還原 playMusic(e) 原始 truthy/falsy 行為。
- 首頁直接使用 userProfile.music，不使用 BGM10 fallback。
- 劇情沒有 music 時依原始邏輯停止音樂。
- battleMusic 保持 /audio/music/BGM24.mp3。
- 還原原始 music loader 與 resumeMusic。

音量面板仍保留，但只透過 HTMLMediaElement.play 外部 hook 調整音量，
不改寫 playMusic 的選曲、切換或停止判斷。

部署：將 static/js/main.94fae2cd.js 覆蓋網站對應檔案；也可整包覆蓋。
