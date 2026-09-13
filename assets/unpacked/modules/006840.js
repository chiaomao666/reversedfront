
      function o(e) {
        return e && e.Math == Math && e;
      }
      e.exports = o(typeof globalThis == "object" && globalThis) || o(typeof window == "object" && window) || o(typeof self == "object" && self) || o(typeof n.g == "object" && n.g) || function () {
        return this;
      }() || this || Function("return this")();
    }