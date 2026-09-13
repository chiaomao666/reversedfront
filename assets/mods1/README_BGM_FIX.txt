RF BGM 修正說明
================

本版修正首頁與劇情沒有 BGM 的三個原因：

1. 還原設定：
   battleMusic: "/audio/music/BGM24.mp3"

2. playMusic 參數處理：
   - false 或 null：明確要求停止音樂。
   - undefined、空字串、字串 "undefined"/"null"：忽略，不再誤把目前 BGM 暫停。

3. 首頁 BGM：
   - userProfile.music 有值時使用個人設定。
   - 沒有值時回退到 /audio/music/BGM10.mp3。

4. 劇情分鏡：
   - music 有路徑：切換到該 BGM。
   - music === false：明確停止 BGM。
   - 沒有 music 欄位：延續上一首 BGM，不再自動暫停。

若仍無聲，先在 Console 執行：
  RFAudio.getState()
確認 music.volume 大於 0 且 music.muted 為 false。
可直接重設：
  RFAudio.setMuted("music", false)
  RFAudio.setVolume("music", 1)

音訊設定保存在 localStorage 的 rfAudioSettingsV1。
