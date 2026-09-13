// dc_monitor_capture.js - 攔截並整理 [DCContext] 這類內部除錯 log，即時廣播給監控網站
// v2：除了原本的分類 + 摘要文字，還會嘗試從資料裡拆出「結構化紀錄」(records)，
//     讓監控網站可以把城鎮/聯盟/國家資料做成可篩選、排序、跨場次保存的表格，
//     而不只是一行滾動式的摘要文字。
//
// 注意：這個遊戲版本裡 "[DCContext]" 是跟訊息文字合併成同一個字串
// （例如 "[DCContext] _updateData changed cities ==========="），
// 不是分開的獨立參數，所以要用正規表示式從這個合併字串裡拆出真正的訊息文字，
// 再依內容歸類；第二個參數起才是真正的資料。
// 拆解時一律只保留基本型別欄位（字串/數字/布林），巢狀物件/陣列只標記筆數，
// 不整包深拷貝或 JSON.stringify，避免資料量爆炸或卡頓。

console.log("[DCMON] 啟動外部副程式：DCContext 監控擷取器已載入 (v2 支援結構化紀錄)");

(function () {
  const CHANNEL_NAME = "rf_dc_monitor";
  const channel = new BroadcastChannel(CHANNEL_NAME);
  const originalLog = console.log.bind(console);
  const MAX_TEXT_LEN = 400; // 字串一律強制截斷，避免任何格式抓漏都不會爆量
  const MAX_RECORDS_PER_MSG = 300; // 單次訊息最多拆出的紀錄數

  // 用來猜「這筆紀錄的唯一鍵」是哪個欄位，依序嘗試
  const ID_KEYS = ["id", "city_id", "union_id", "nation_id", "actor_id", "site_id"];
  const NAME_KEYS = ["name", "city_name", "union_name", "city", "nation"];

  function capText(s) {
    s = String(s == null ? "" : s);
    return s.length > MAX_TEXT_LEN ? s.slice(0, MAX_TEXT_LEN) + "…(截斷)" : s;
  }

  function pickLabel(item) {
    if (!item || typeof item !== "object") return String(item);
    const keys = ["name", "city_name", "union_name", "id", "city_id", "union_id"];
    for (const k of keys) {
      if (item[k] !== undefined) return k + "=" + item[k];
    }
    return null;
  }

  function summarize(v) {
    // 不做完整深拷貝/JSON.stringify，只挑幾個關鍵欄位組成一句話摘要
    if (v === undefined || v === null) return "";
    if (Array.isArray(v)) {
      if (v.length === 0) return "空陣列";
      const label = pickLabel(v[0]);
      return v.length + " 筆" + (label ? "（例如 " + label + "）" : "");
    }
    if (typeof v === "object") {
      try {
        return Object.keys(v)
          .map((k) => {
            const val = v[k];
            if (Array.isArray(val)) return k + ":" + val.length + "筆";
            if (val && typeof val === "object") return k + ":{...}";
            return k + ":" + val;
          })
          .join(", ");
      } catch (e) {
        return "[object]";
      }
    }
    return String(v);
  }

  // 把任意值攤平成「只有基本型別欄位」的物件；巢狀物件/陣列改標記筆數，
  // 這樣表格欄位固定是字串/數字/布林，不會因為深層結構把畫面撐爆。
  function flattenRecord(item) {
    if (item === null || item === undefined) return { 值: "" };
    if (typeof item !== "object") return { 值: item };
    const out = {};
    for (const k of Object.keys(item)) {
      const v = item[k];
      if (v === null || v === undefined) {
        out[k] = "";
        continue;
      }
      const t = typeof v;
      if (t === "string") out[k] = capText(v);
      else if (t === "number" || t === "boolean") out[k] = v;
      else if (Array.isArray(v)) out[k] = "[" + v.length + " 筆]";
      else if (t === "object") out[k] = "{...}";
      else out[k] = String(v);
    }
    return out;
  }

  // 從資料裡找出可以拆成表格的紀錄：
  // 1. 本身就是「物件陣列」-> 直接用每個元素當一筆紀錄
  // 2. 是物件，裡面某個欄位是「物件陣列」-> 挑最長的那個欄位當紀錄來源
  // 3. 是單一物件（沒有陣列欄位）-> 整個物件當成一筆紀錄（每次事件更新同一列，適合像
  //    city_sites 那種彙總物件）
  // 4. 其他（純數字/字串/undefined）-> 回傳 null，代表沒有結構化資料可拆，只保留摘要文字
  function extractRecords(v, category) {
    if (Array.isArray(v)) {
      if (v.length === 0) return null;
      return { records: v.slice(0, MAX_RECORDS_PER_MSG).map(flattenRecord), singleton: false };
    }
    if (v && typeof v === "object") {
      let bestKey = null,
        bestArr = null;
      for (const k of Object.keys(v)) {
        if (Array.isArray(v[k]) && v[k].length > 0 && typeof v[k][0] === "object") {
          if (!bestArr || v[k].length > bestArr.length) {
            bestKey = k;
            bestArr = v[k];
          }
        }
      }
      if (bestArr) {
        return {
          records: bestArr.slice(0, MAX_RECORDS_PER_MSG).map(flattenRecord),
          singleton: false,
          sourceKey: bestKey,
        };
      }
      // 沒有陣列欄位，整個物件當一筆
      return { records: [flattenRecord(v)], singleton: true, singletonKey: "singleton_" + category };
    }
    return null;
  }

  function recordKey(rec, extraction) {
    if (extraction.singleton) return extraction.singletonKey;
    for (const k of ID_KEYS) if (rec[k] !== undefined && rec[k] !== "") return k + ":" + rec[k];
    for (const k of NAME_KEYS) if (rec[k] !== undefined && rec[k] !== "") return k + ":" + rec[k];
    return null; // 無法辨識唯一鍵，前端會用時間戳當一次性列（不去重）
  }

  // 依訊息文字內容分類，用關鍵字比對，不是精準比對整串文字
  const RULES = [
    { category: "changed_cities", test: (t) => /changed cities|checkCities|cities\.length/i.test(t) },
    {
      category: "changed_unions",
      test: (t) => /changed unions|unions\(after\)|_union\s*成功|getRecommendUnions|myUnion/i.test(t),
    },
    { category: "changed_nations", test: (t) => /changed nations|myNation|nationsSp/i.test(t) },
    {
      category: "changed_other",
      test: (t) => /changed contacts|changed union_contacts|_changedData|_mergeData|_removeData/i.test(t),
    },
    { category: "presence_socket", test: (t) => /\[Socket\]|window_onerror|連線/i.test(t) },
    { category: "audio", test: (t) => /playMusic|playSound|pauseMusic|resumeMusic/i.test(t) },
    { category: "locale", test: (t) => /\[i18n\]|ChannelLocale|locale/i.test(t) },
    { category: "maintenance", test: (t) => /\[maintenance\]|not OK/i.test(t) },
    {
      category: "actor_actions",
      test: (t) =>
        /update_actor|update_team|upgrade\s*成功|evolute|recruit|collect_bundle|new_attack|cacuActorUpgradeExp/i.test(
          t
        ),
    },
  ];

  function classify(fullTag) {
    for (const rule of RULES) {
      if (rule.test(fullTag)) return rule.category;
    }
    return "other";
  }

  console.log = function (...args) {
    if (args.length > 0 && typeof args[0] === "string" && args[0].indexOf("[DCContext]") === 0) {
      try {
        // 拆出 "[DCContext] " 後面的訊息文字
        const fullTag = args[0].replace(/^\[DCContext\]\s*/, "").trim() || "(空白訊息)";
        const category = classify(fullTag);
        const summary = summarize(args[1]);
        const extraction = extractRecords(args[1], category);

        let records = null;
        if (extraction) {
          records = extraction.records.map((rec) => ({
            __key: recordKey(rec, extraction),
            __sourceKey: extraction.sourceKey || null,
            ...rec,
          }));
        }

        channel.postMessage({
          ts: Date.now(),
          category,
          detail: capText(fullTag),
          summary: capText(summary || ""),
          records,
        });
      } catch (e) {
        // 分類/拆解失敗不影響原本的 log 行為
      }
    }
    return originalLog(...args);
  };

  console.log("[DCMON] 攔截已啟動，透過 BroadcastChannel('" + CHANNEL_NAME + "') 廣播（含結構化紀錄）");
})();
