
      var o = n(75951);
      var a = n(45884);
      var r = n(4237);
      e.exports = Object.setPrototypeOf || (() => {
        if ("__proto__" in {}) {
          return function () {
            var e;
            var t = false;
            var n = {};
            try {
              (e = o(Object.prototype, "__proto__", "set"))(n, []);
              t = n instanceof Array;
            } catch (i) {}
            return function (n, o) {
              a(n);
              r(o);
              (() => {
                if (t) {
                  return e(n, o);
                } else {
                  return n.__proto__ = o;
                }
              })();
              return n;
            };
          }();
        } else {
          return undefined;
        }
      })();
    }