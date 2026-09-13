
      var o = n(6840);
      var a = n(91778);
      var r = n(73013);
      var i = n(24839);
      var s = n(20166);
      var c = n(47611);
      var l = o.Symbol;
      var u = a("wks");
      var p = (() => {
        if (c) {
          return l.for || l;
        } else {
          return l && l.withoutSetter || i;
        }
      })();
      e.exports = function (e) {
        if (!r(u, e)) {
          u[e] = (() => {
            if (s && r(l, e)) {
              return l[e];
            } else {
              return p("Symbol." + e);
            }
          })();
        }
        return u[e];
      };
    }