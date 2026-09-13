
      "use strict";

      var o;
      var a = n(27828);
      var r = n(23347);
      try {
        o = [].__proto__ === Array.prototype;
      } catch (l) {
        if (!l || typeof l !== "object" || !("code" in l) || l.code !== "ERR_PROTO_ACCESS") {
          throw l;
        }
      }
      var i = !!o && r && r(Object.prototype, "__proto__");
      var s = Object;
      var c = s.getPrototypeOf;
      e.exports = (() => {
        if (i && typeof i.get === "function") {
          return a([i.get]);
        } else {
          return typeof c === "function" && function (e) {
            return c((() => {
              if (e == null) {
                return e;
              } else {
                return s(e);
              }
            })());
          };
        }
      })();
    }