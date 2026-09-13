
      "use strict";

      var o = n(7543);
      var a = n(75167);
      var r = n(42584);
      var i = n(88364);
      var s = n(87822);
      var c = o("%WeakMap%", true);
      var l = a("WeakMap.prototype.get", true);
      var u = a("WeakMap.prototype.set", true);
      var p = a("WeakMap.prototype.has", true);
      var d = a("WeakMap.prototype.delete", true);
      e.exports = (() => {
        if (c) {
          return function () {
            var e;
            var t;
            var n = {
              assert: function (e) {
                if (!n.has(e)) {
                  throw new s("Side channel does not contain " + r(e));
                }
              },
              delete: function (n) {
                if (c && n && (typeof n === "object" || typeof n === "function")) {
                  if (e) {
                    return d(e, n);
                  }
                } else if (i && t) {
                  return t.delete(n);
                }
                return false;
              },
              get: function (n) {
                return (() => {
                  if (c && n && (typeof n === "object" || typeof n === "function") && e) {
                    return l(e, n);
                  } else {
                    return t && t.get(n);
                  }
                })();
              },
              has: function (n) {
                return (() => {
                  if (c && n && (typeof n === "object" || typeof n === "function") && e) {
                    return p(e, n);
                  } else {
                    return !!t && t.has(n);
                  }
                })();
              },
              set: function (n, o) {
                (() => {
                  if (c && n && (typeof n === "object" || typeof n === "function")) {
                    e ||= new c();
                    return u(e, n, o);
                  } else {
                    return i && (t ||= i(), t.set(n, o));
                  }
                })();
              }
            };
            return n;
          };
        } else {
          return i;
        }
      })();
    }