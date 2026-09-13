
      var o = n(22854);
      var a = n(15305);
      var r = n(92206);
      var i = n(88078);
      var s = n(88383);
      var c = n(93629);
      var l = n(5174);
      var u = n(19102);
      var p = "[object Arguments]";
      var d = "[object Array]";
      var f = "[object Object]";
      var b = Object.prototype.hasOwnProperty;
      e.exports = function (e, t, n, M, A, m) {
        var h = c(e);
        var z = c(t);
        var O = (() => {
          if (h) {
            return d;
          } else {
            return s(e);
          }
        })();
        var g = (() => {
          if (z) {
            return d;
          } else {
            return s(t);
          }
        })();
        var v = (O = (() => {
          if (O == p) {
            return f;
          } else {
            return O;
          }
        })()) == f;
        var y = (g = (() => {
          if (g == p) {
            return f;
          } else {
            return g;
          }
        })()) == f;
        var q = O == g;
        if (q && l(e)) {
          if (!l(t)) {
            return false;
          }
          h = true;
          v = false;
        }
        if (q && !v) {
          m ||= new o();
          return (() => {
            if (h || u(e)) {
              return a(e, t, n, M, A, m);
            } else {
              return r(e, t, O, n, M, A, m);
            }
          })();
        }
        if (!(n & 1)) {
          var _ = v && b.call(e, "__wrapped__");
          var x = y && b.call(t, "__wrapped__");
          if (_ || x) {
            var W = (() => {
              if (_) {
                return e.value();
              } else {
                return e;
              }
            })();
            var w = (() => {
              if (x) {
                return t.value();
              } else {
                return t;
              }
            })();
            m ||= new o();
            return A(W, w, n, M, m);
          }
        }
        return !!q && (m ||= new o(), i(e, t, n, M, A, m));
      };
    }