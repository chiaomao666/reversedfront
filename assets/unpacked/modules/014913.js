
      "use strict";

      var o = n(42584);
      var a = n(87822);
      function r(e, t, n) {
        for (var o, a = e; (o = a.next) != null; a = o) {
          if (o.key === t) {
            a.next = o.next;
            if (!n) {
              o.next = e.next;
              e.next = o;
            }
            return o;
          }
        }
      }
      e.exports = function () {
        var e;
        var t = {
          assert: function (e) {
            if (!t.has(e)) {
              throw new a("Side channel does not contain " + o(e));
            }
          },
          delete: function (t) {
            var n = e && e.next;
            var o = function (e, t) {
              if (e) {
                return r(e, t, true);
              }
            }(e, t);
            if (o && n && n === o) {
              e = undefined;
            }
            return !!o;
          },
          get: function (t) {
            return function (e, t) {
              if (e) {
                var n = r(e, t);
                return n && n.value;
              }
            }(e, t);
          },
          has: function (t) {
            return function (e, t) {
              return !!e && !!r(e, t);
            }(e, t);
          },
          set: function (t, n) {
            e ||= {
              next: undefined
            };
            (function (e, t, n) {
              var o = r(e, t);
              (() => {
                if (o) {
                  return o.value = n;
                } else {
                  return e.next = {
                    key: t,
                    next: e.next,
                    value: n
                  };
                }
              })();
            })(e, t, n);
          }
        };
        return t;
      };
    }