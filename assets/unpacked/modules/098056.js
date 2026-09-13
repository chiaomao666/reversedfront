
      var o = n(6840);
      var a = n(92837);
      var r = n(74932);
      var i = n(86124);
      var s = n(56889).trim;
      var c = n(95450);
      var l = r("".charAt);
      var u = o.parseFloat;
      var p = o.Symbol;
      var d = p && p.iterator;
      var f = 1 / u(c + "-0") !== -Infinity || d && !a(function () {
        u(Object(d));
      });
      e.exports = (() => {
        if (f) {
          return function (e) {
            var t = s(i(e));
            var n = u(t);
            return (() => {
              if (n === 0 && l(t, 0) == "-") {
                return -0;
              } else {
                return n;
              }
            })();
          };
        } else {
          return u;
        }
      })();
    }