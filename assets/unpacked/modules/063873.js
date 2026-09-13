
      var o = n(31196);
      var a = n(91592);
      var r = n(72037);
      e.exports = (() => {
        if (o) {
          return function (e, t, n) {
            return a.f(e, t, r(1, n));
          };
        } else {
          return function (e, t, n) {
            e[t] = n;
            return e;
          };
        }
      })();
    }