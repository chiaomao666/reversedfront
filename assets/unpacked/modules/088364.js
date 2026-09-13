
      "use strict";

      var o = n(43085);
      var a = n(75167);
      var r = n(42584);
      var i = n(87822);
      var s = o("%Map%", true);
      var c = a("Map.prototype.get", true);
      var l = a("Map.prototype.set", true);
      var u = a("Map.prototype.has", true);
      var p = a("Map.prototype.delete", true);
      var d = a("Map.prototype.size", true);
      e.exports = !!s && function () {
        var e;
        var t = {
          assert: function (e) {
            if (!t.has(e)) {
              throw new i("Side channel does not contain " + r(e));
            }
          },
          delete: function (t) {
            if (e) {
              var n = p(e, t);
              if (d(e) === 0) {
                e = undefined;
              }
              return n;
            }
            return false;
          },
          get: function (t) {
            if (e) {
              return c(e, t);
            }
          },
          has: function (t) {
            return !!e && u(e, t);
          },
          set: function (t, n) {
            e ||= new s();
            l(e, t, n);
          }
        };
        return t;
      };
    }