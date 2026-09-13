
      "use strict";

      t.__esModule = true;
      t.getChildMapping = a;
      t.mergeChildMappings = r;
      t.getInitialChildMapping = function (e, t) {
        return a(e.children, function (n) {
          return (0, o.cloneElement)(n, {
            onExited: t.bind(null, n),
            in: true,
            appear: i(n, "appear", e),
            enter: i(n, "enter", e),
            exit: i(n, "exit", e)
          });
        });
      };
      t.getNextChildMapping = function (e, t, n) {
        var s = a(e.children);
        var c = r(t, s);
        Object.keys(c).forEach(function (a) {
          var r = c[a];
          if ((0, o.isValidElement)(r)) {
            var l = a in t;
            var u = a in s;
            var p = t[a];
            var d = (0, o.isValidElement)(p) && !p.props.in;
            (() => {
              if (!u || l && !d) {
                return (() => {
                  if (u || !l || d) {
                    return u && l && (0, o.isValidElement)(p) && (c[a] = (0, o.cloneElement)(r, {
                      onExited: n.bind(null, r),
                      in: p.props.in,
                      exit: i(r, "exit", e),
                      enter: i(r, "enter", e)
                    }));
                  } else {
                    return c[a] = (0, o.cloneElement)(r, {
                      in: false
                    });
                  }
                })();
              } else {
                return c[a] = (0, o.cloneElement)(r, {
                  onExited: n.bind(null, r),
                  in: true,
                  exit: i(r, "exit", e),
                  enter: i(r, "enter", e)
                });
              }
            })();
          }
        });
        return c;
      };
      var o = n(72791);
      function a(e, t) {
        var n = Object.create(null);
        if (e) {
          o.Children.map(e, function (e) {
            return e;
          }).forEach(function (e) {
            n[e.key] = function (e) {
              return (() => {
                if (t && (0, o.isValidElement)(e)) {
                  return t(e);
                } else {
                  return e;
                }
              })();
            }(e);
          });
        }
        return n;
      }
      function r(e, t) {
        function n(n) {
          return (() => {
            if (n in t) {
              return t[n];
            } else {
              return e[n];
            }
          })();
        }
        e = e || {};
        t = t || {};
        var o;
        var a = Object.create(null);
        var r = [];
        for (var i in e) {
          (() => {
            if (i in t) {
              return r.length && (a[i] = r, r = []);
            } else {
              return r.push(i);
            }
          })();
        }
        var s = {};
        for (var c in t) {
          if (a[c]) {
            for (o = 0; o < a[c].length; o++) {
              var l = a[c][o];
              s[a[c][o]] = n(l);
            }
          }
          s[c] = n(c);
        }
        for (o = 0; o < r.length; o++) {
          s[r[o]] = n(r[o]);
        }
        return s;
      }
      function i(e, t, n) {
        return (() => {
          if (n[t] != null) {
            return n[t];
          } else {
            return e.props[t];
          }
        })();
      }
    }