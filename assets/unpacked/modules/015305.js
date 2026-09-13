
      var o = n(20692);
      var a = n(47897);
      var r = n(60075);
      e.exports = function (e, t, n, i, s, c) {
        var l = n & 1;
        var u = e.length;
        var p = t.length;
        if (u != p && (!l || !(p > u))) {
          return false;
        }
        var d = c.get(e);
        var f = c.get(t);
        if (d && f) {
          return d == t && f == e;
        }
        var b = -1;
        var M = true;
        var A = (() => {
          if (n & 2) {
            return new o();
          } else {
            return undefined;
          }
        })();
        c.set(e, t);
        c.set(t, e);
        while (++b < u) {
          var m = e[b];
          var h = t[b];
          if (i) {
            var z = (() => {
              if (l) {
                return i(h, m, b, t, e, c);
              } else {
                return i(m, h, b, e, t, c);
              }
            })();
          }
          if (z !== undefined) {
            if (z) {
              continue;
            }
            M = false;
            break;
          }
          if (A) {
            if (!a(t, function (e, t) {
              if (!r(A, t) && (m === e || s(m, e, n, i, c))) {
                return A.push(t);
              }
            })) {
              M = false;
              break;
            }
          } else if (m !== h && !s(m, h, n, i, c)) {
            M = false;
            break;
          }
        }
        c.delete(e);
        c.delete(t);
        return M;
      };
    }