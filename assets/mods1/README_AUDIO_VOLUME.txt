RF 三類音量控制修正版
========================

請覆蓋／新增以下檔案：

1. static/js/main.94fae2cd.js
2. index.html
3. rf_mod.js
4. rf_audio_panel.js（新增）

其餘檔案延續上一版，可直接保留。

功能：
- 效果音：辨識 /audio/sound_effect/ 路徑。
- 背景音樂：辨識 /audio/music/ 路徑與循環播放的 Audio。
- 角色語音：其餘從遊戲音訊入口播放的音檔。
- 三類均可獨立調整 0–100% 或靜音。
- 0%／靜音時，效果音與語音會在播放入口直接跳過，不再下載或建立無聲 Audio。
- BGM 靜音時會暫停；解除靜音時會嘗試續播。
- 設定保存在 localStorage 的 rfAudioSettingsV1。
- 面板可拖曳、收合，位置保存在 rfAudioPanelPositionV1。

Console API：
RFAudio.setVolume("effects", 0.5); // 50%
RFAudio.setVolume("music", 0.3);   // 30%
RFAudio.setVolume("voice", 1);     // 100%
RFAudio.setMuted("effects", true);
RFAudio.getState();
RFAudio.reset();

相容 API：
RFMod.setMuteButtonSound(true) 會改為靜音整個「效果音」分類。

注意：
- 角色語音採「非 music、非 sound_effect」的音訊路徑作為分類規則。
- 若伺服器日後將角色語音也放進 /audio/sound_effect/，需再加入更精確的路徑規則。

選擇性動畫控制補充
------------------
本包已移除全域 animation/transition 截斷。reduceMotion 僅作用於先前指定的首頁齒輪、角色 spritesheet 與 highlight circle；每日登入獎勵、Modal 進出場及右上角選單滑動會維持原始動畫。
