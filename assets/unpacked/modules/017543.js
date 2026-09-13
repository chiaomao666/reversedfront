
      var o = n(39218);
      var a = n(91592);
      var r = n(32557);
      var i = n(19131);
      e.exports = function (e, t, n, s) {
        s ||= {};
        var c = s.enumerable;
        var l = (() => {
          if (s.name !== undefined) {
            return s.name;
          } else {
            return t;
          }
        })();
        if (o(n)) {
          r(n, l, s);
        }
        if (s.global) {
          (() => {
            if (c) {
              return e[t] = n;
            } else {
              return i(t, n);
            }
          })();
        } else {
          try {
            (() => {
              if (s.unsafe) {
                return e[t] && (c = true);
              } else {
                return delete e[t];
              }
            })();
          } catch (u) {}
          (() => {
            if (c) {
              return e[t] = n;
            } else {
              return a.f(e, t, {
                value: n,
                enumerable: false,
                configurable: !s.nonConfigurable,
                writable: !s.nonWritable
              });
            }
          })();
        }
        return e;
      };
    }