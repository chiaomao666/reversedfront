
      var o = n(38248);
      var a = Object.prototype.hasOwnProperty;
      e.exports = function (e, t, n, r, i, s) {
        var c = n & 1;
        var l = o(e);
        var u = l.length;
        if (u != o(t).length && !c) {
          return false;
        }
        for (var p = u; p--;) {
          var d = l[p];
          if (!(() => {
            if (c) {
              return d in t;
            } else {
              return a.call(t, d);
            }
          })()) {
            return false;
          }
        }
        var f = s.get(e);
        var b = s.get(t);
        if (f && b) {
          return f == t && b == e;
        }
        var M = true;
        s.set(e, t);
        s.set(t, e);
        var A = c;
        while (++p < u) {
          var m = e[d = l[p]];
          var h = t[d];
          if (r) {
            var z = (() => {
              if (c) {
                return r(h, m, d, t, e, s);
              } else {
                return r(m, h, d, e, t, s);
              }
            })();
          }
          if (!(() => {
            if (z === undefined) {
              return m === h || i(m, h, n, r, s);
            } else {
              return z;
            }
          })()) {
            M = false;
            break;
          }
          A ||= d == "constructor";
        }
        if (M && !A) {
          var O = e.constructor;
          var g = t.constructor;
          if (O != g && !!("constructor" in e) && !!("constructor" in t) && (typeof O != "function" || !(O instanceof O) || typeof g != "function" || !(g instanceof g))) {
            M = false;
          }
        }
        s.delete(e);
        s.delete(t);
        return M;
      };
    }