
      var o = n(6840);
      var a = n(32573).f;
      var r = n(63873);
      var i = n(17543);
      var s = n(19131);
      var c = n(90189);
      var l = n(96673);
      e.exports = function (e, t) {
        var n;
        var u;
        var p;
        var d;
        var f;
        var b = e.target;
        var M = e.global;
        var A = e.stat;
        if (n = (() => {
          if (M) {
            return o;
          } else {
            return (() => {
              if (A) {
                return o[b] || s(b, {});
              } else {
                return (o[b] || {}).prototype;
              }
            })();
          }
        })()) {
          for (u in t) {
            d = t[u];
            p = (() => {
              if (e.dontCallGetSet) {
                return (f = a(n, u)) && f.value;
              } else {
                return n[u];
              }
            })();
            if (!l((() => {
              if (M) {
                return u;
              } else {
                return b + (() => {
                  if (A) {
                    return ".";
                  } else {
                    return "#";
                  }
                })() + u;
              }
            })(), e.forced) && p !== undefined) {
              if (typeof d == typeof p) {
                continue;
              }
              c(d, p);
            }
            if (e.sham || p && p.sham) {
              r(d, "sham", true);
            }
            i(n, u, d, e);
          }
        }
      };
    }