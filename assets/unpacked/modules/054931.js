
      "use strict";

      var o = n(67768);
      var a = n(98513);
      var r = n(23608);
      var i = n(23211);
      var s = n(39218);
      var c = n(1331);
      var l = n(24305);
      var u = n(4381);
      var p = n(53370);
      var d = n(63873);
      var f = n(17543);
      var b = n(95028);
      var M = n(29706);
      var A = n(27022);
      var m = i.PROPER;
      var h = i.CONFIGURABLE;
      var z = A.IteratorPrototype;
      var O = A.BUGGY_SAFARI_ITERATORS;
      var g = b("iterator");
      var v = "keys";
      var y = "values";
      var q = "entries";
      function _() {
        return this;
      }
      e.exports = function (e, t, n, i, b, A, x) {
        c(n, t, i);
        var W;
        var w;
        var R;
        function k(e) {
          if (e === b && E) {
            return E;
          }
          if (!O && e in N) {
            return N[e];
          }
          switch (e) {
            case v:
            case y:
            case q:
              return function () {
                return new n(this, e);
              };
          }
          return function () {
            return new n(this);
          };
        }
        var L = t + " Iterator";
        var S = false;
        var N = e.prototype;
        var C = N[g] || N["@@iterator"] || b && N[b];
        var E = !O && C || k(b);
        var B = t == "Array" && N.entries || C;
        if (B && (W = l(B.call(new e()))) !== Object.prototype && W.next) {
          if (!r && l(W) !== z) {
            (() => {
              if (u) {
                return u(W, z);
              } else {
                return s(W[g]) || f(W, g, _);
              }
            })();
          }
          p(W, L, true, true);
          if (r) {
            M[L] = _;
          }
        }
        if (m && b == y && C && C.name !== y) {
          (() => {
            if (!r && h) {
              return d(N, "name", y);
            } else {
              S = true;
              return E = function () {
                return a(C, this);
              };
            }
          })();
        }
        if (b) {
          w = {
            values: k(y),
            keys: (() => {
              if (A) {
                return E;
              } else {
                return k(v);
              }
            })(),
            entries: k(q)
          };
          if (x) {
            for (R in w) {
              if (O || S || !(R in N)) {
                f(N, R, w[R]);
              }
            }
          } else {
            o({
              target: t,
              proto: true,
              forced: O || S
            }, w);
          }
        }
        if ((!r || !!x) && N[g] !== E) {
          f(N, g, E, {
            name: b
          });
        }
        M[t] = E;
        return w;
      };
    }