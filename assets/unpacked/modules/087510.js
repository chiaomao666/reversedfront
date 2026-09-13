
      "use strict";

      var o = n(87822);
      var a = n(42584);
      var r = n(14913);
      var i = n(88364);
      var s = n(49991) || i || r;
      e.exports = function () {
        var e;
        var t = {
          assert: function (e) {
            if (!t.has(e)) {
              throw new o("Side channel does not contain " + a(e));
            }
          },
          delete: function (t) {
            return !!e && e.delete(t);
          },
          get: function (t) {
            return e && e.get(t);
          },
          has: function (t) {
            return !!e && e.has(t);
          },
          set: function (t, n) {
            e ||= s();
            e.set(t, n);
          }
        };
        return t;
      };
    }