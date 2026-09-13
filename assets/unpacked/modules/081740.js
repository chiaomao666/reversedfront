
      var o = n(6840);
      var a = n(50650);
      var r = n(22752);
      var i = n(18887);
      var s = n(63873);
      var c = n(95028);
      var l = c("iterator");
      var u = c("toStringTag");
      var p = i.values;
      function d(e, t) {
        if (e) {
          if (e[l] !== p) {
            try {
              s(e, l, p);
            } catch (o) {
              e[l] = p;
            }
          }
          if (!e[u]) {
            s(e, u, t);
          }
          if (a[t]) {
            for (var n in i) {
              if (e[n] !== i[n]) {
                try {
                  s(e, n, i[n]);
                } catch (o) {
                  e[n] = i[n];
                }
              }
            }
          }
        }
      }
      for (var f in a) {
        d(o[f] && o[f].prototype, f);
      }
      d(r, "DOMTokenList");
    }