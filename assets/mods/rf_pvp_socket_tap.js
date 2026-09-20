// RF PVP Socket 被動觀察器
// 固定位置：assets/mods/rf_pvp_socket_tap.js
// 只觀察官方 WebSocket 已接收的排名戰相關訊框；不修改、阻擋、重送或延遲遊戲封包。
(function () {
  "use strict";

  const MOD_NAME = "RF PVP Socket 被動觀察器";
  const existingTap = window.__RF_PVP_SOCKET_TAP__;
  if (existingTap && typeof existingTap.ensure === "function") {
    existingTap.ensure();
    console.log(`[${MOD_NAME}] 已使用既有觀察器。`);
    return;
  }
  if (existingTap) {
    console.warn(`[${MOD_NAME}] 偵測到不相容的既有觀察器，未覆寫。`);
    return;
  }

  const subscribers = new Set();
  const stats = {
    installedAt: Date.now(),
    socketCount: 0,
    receivedMessageCount: 0,
    forwardedFrameCount: 0,
    candidateFrameCount: 0,
    lastCandidate: null,
    reinstallCount: 0,
  };
  let ObservedWebSocket = null;

  function decodeFrame(data) {
    if (typeof data !== "string") return { raw: String(data), topic: "", event: "", payload: null };
    try {
      const decoded = JSON.parse(data);
      if (Array.isArray(decoded)) {
        return { raw: decoded, topic: String(decoded[2] || ""), event: String(decoded[3] || ""), payload: decoded[4] ?? null };
      }
      if (decoded && typeof decoded === "object") {
        return {
          raw: decoded,
          topic: String(decoded.topic || decoded.channel || ""),
          event: String(decoded.event || decoded.type || ""),
          payload: decoded.payload ?? decoded.data ?? null,
        };
      }
      return { raw: decoded, topic: "", event: "", payload: null };
    } catch (_) {
      return { raw: data, topic: "", event: "", payload: null };
    }
  }

  // 陣營清單（getNations 的官方回覆）是一個純陣列，每筆至少有 id/name/flag 或 title；
  // 用形狀判斷，不依賴事件名稱，因為觀察到的是原始 Phoenix payload，事件名稱不一定可靠。
  function looksLikeNationsArray(value) {
    if (!Array.isArray(value) || value.length < 2) return false;
    const sample = value.find((item) => item && typeof item === "object" && !Array.isArray(item));
    return Boolean(sample && "id" in sample && ("flag" in sample || "title" in sample) &&
      (typeof sample.name === "string" || typeof sample.title === "string"));
  }

  function isPvpFrame(frame) {
    const signature = `${frame.topic} ${frame.event}`.toLowerCase();
    if (signature.includes("pvp")) return true;

    // 不再依賴 location.hash（player:<id> channel 整個 session 都連著，跟畫面在哪無關）；
    // 改成直接看 payload 本身的形狀是不是官方 medals 回覆或陣營清單。
    if (/^player:\d+$/i.test(String(frame.topic || ""))) {
      const payload = frame.payload;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        const looksLikeMedals = "medals" in payload || "1v1" in payload || "3v3" in payload || "5v5" in payload;
        if (looksLikeMedals) return true;
        // Phoenix reply 格式：排名資料在 payload.response 裡，不在頂層
        const response = payload.response;
        if (response && typeof response === "object" && !Array.isArray(response)) {
          const looksLikeRankingResponse = "1v1" in response || "3v3" in response || "5v5" in response || "medals" in response;
          if (looksLikeRankingResponse) return true;
        }
        if (looksLikeNationsArray(payload.response)) return true;
        if (looksLikeNationsArray(payload.nations)) return true;
        if (looksLikeNationsArray(payload.rawNations)) return true;
      }
      if (looksLikeNationsArray(payload)) return true;
    }
    return false;
  }

  function summariseCandidate(frame) {
    const payload = frame.payload && typeof frame.payload === "object" && !Array.isArray(frame.payload) ? frame.payload : null;
    return {
      diagnosticOnly: true,
      capturedAt: Date.now(),
      topic: String(frame.topic || "").replace(/\d+/g, "#").slice(0, 80) || "(none)",
      event: String(frame.event || "(none)").slice(0, 80),
      payloadKeys: Object.keys(payload || {}).slice(0, 12),
      pageHash: location.hash,
    };
  }

  function publish(data, url) {
    const frame = decodeFrame(data);
    stats.receivedMessageCount += 1;
    const pvpFrame = isPvpFrame(frame);
    const battlePage = location.hash.toLowerCase().includes("/pvpbattle");
    if (!pvpFrame && !battlePage) return;
    const entry = pvpFrame
      ? { ...frame, capturedAt: Date.now(), socketUrl: url || "", pageHash: location.hash }
      : summariseCandidate(frame);
    if (pvpFrame) stats.forwardedFrameCount += 1;
    else {
      stats.candidateFrameCount += 1;
      stats.lastCandidate = entry;
    }
    subscribers.forEach((listener) => {
      try { listener(entry); } catch (error) { console.error(`[${MOD_NAME}] 訂閱者失敗：`, error); }
    });
  }

  function installObservedConstructor() {
    const NativeWebSocket = window.WebSocket;
    if (NativeWebSocket === ObservedWebSocket) return true;
    if (typeof NativeWebSocket !== "function") {
      console.warn(`[${MOD_NAME}] 無法安裝：WebSocket 不可用。`);
      return false;
    }

    function PassiveObservedWebSocket(url, protocols) {
      const socket = arguments.length > 1 ? new NativeWebSocket(url, protocols) : new NativeWebSocket(url);
      stats.socketCount += 1;
      socket.addEventListener("message", (event) => publish(event.data, socket.url));
      return socket;
    }

    PassiveObservedWebSocket.prototype = NativeWebSocket.prototype;
    Object.setPrototypeOf(PassiveObservedWebSocket, NativeWebSocket);
    ObservedWebSocket = PassiveObservedWebSocket;
    window.WebSocket = ObservedWebSocket;
    stats.reinstallCount += 1;
    return true;
  }

  if (!installObservedConstructor()) return;
  const tap = {
    subscribe(listener) {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    getStatus() { return { ...stats, active: window.WebSocket === ObservedWebSocket }; },
    ensure() { return installObservedConstructor(); },
  };
  window.__RF_PVP_SOCKET_TAP__ = tap;

  const ensureAfterReturn = () => tap.ensure();
  window.addEventListener("pageshow", ensureAfterReturn);
  window.addEventListener("focus", ensureAfterReturn);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) ensureAfterReturn();
  });
  console.log(`[${MOD_NAME}] 已啟用。`);
})();
