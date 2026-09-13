
      var o = n(72791);
      var a = n(71141);
      function r() {
        return (r = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) {
              if (Object.prototype.hasOwnProperty.call(n, o)) {
                e[o] = n[o];
              }
            }
          }
          return e;
        }).apply(this, arguments);
      }
      var i = {
        debug: 10,
        info: 20,
        warn: 30,
        error: 40,
        none: 100
      };
      var s = (() => {
        if (typeof window != "undefined" && window.document && window.document.createElement) {
          return o.useLayoutEffect;
        } else {
          return o.useEffect;
        }
      })();
      t.C = function (e, t) {
        var n = (() => {
          if (e === undefined) {
            return {};
          } else {
            return e;
          }
        })();
        var c = n.logLevel;
        var l = n.maxFontSize;
        var u = (() => {
          if (l === undefined) {
            return 100;
          } else {
            return l;
          }
        })();
        var p = n.minFontSize;
        var d = (() => {
          if (p === undefined) {
            return 20;
          } else {
            return p;
          }
        })();
        var f = n.onFinish;
        var b = n.onStart;
        var M = n.resolution;
        var A = (() => {
          if (M === undefined) {
            return 5;
          } else {
            return M;
          }
        })();
        var m = i[(() => {
          if (c === undefined) {
            return "warn";
          } else {
            return c;
          }
        })()];
        var h = o.useCallback(function () {
          return {
            calcKey: 0,
            fontSize: u,
            fontSizePrev: d,
            fontSizeMax: u,
            fontSizeMin: d
          };
        }, [u, d]);
        var z = o.useRef(null);
        var O = o.useRef(false);
        var g = o.useRef();
        var v = o.useState(h);
        var y = v[0];
        var q = v[1];
        var _ = o.useState(false);
        var x = _[0];
        var W = _[1];
        var w = y.calcKey;
        var R = y.fontSize;
        var k = y.fontSizeMax;
        var L = y.fontSizeMin;
        var S = y.fontSizePrev;
        var N = null;
        var C = o.useState(function () {
          return new window.ResizeObserver(function () {
            N = window.requestAnimationFrame(function () {
              if (!O.current) {
                if (b) {
                  b();
                }
                O.current = true;
                W(true);
                q(r({}, h(), {
                  calcKey: w + 1
                }));
              }
            });
          });
        })[0];
        o.useEffect(function () {
          if (z.current) {
            C.observe(z.current);
          }
          return function () {
            if (N) {
              window.cancelAnimationFrame(N);
            }
            C.disconnect();
          };
        }, [N, C]);
        var E = g.current;
        o.useEffect(function () {
          if (w !== 0 && !O.current) {
            if (!a.dequal(E, t)) {
              if (b) {
                b();
              }
              W(true);
              q(r({}, h(), {
                calcKey: w + 1
              }));
            }
            g.current = t;
          }
        }, [w, h, b, E].concat(t));
        s(function () {
          if (w !== 0) {
            var e = Math.abs(R - S) <= A;
            var t = !!z.current && (z.current.scrollHeight > z.current.offsetHeight || z.current.scrollWidth > z.current.offsetWidth);
            var n = R > S;
            if (e) {
              (() => {
                if (t && R === S) {
                  O.current = false;
                  W(false);
                  return m <= i.info && console.info("[use-fit-text] reached `minFontSize = " + d + "` without fitting text");
                } else {
                  return (() => {
                    if (t) {
                      return q({
                        fontSize: (() => {
                          if (n) {
                            return S;
                          } else {
                            return L;
                          }
                        })(),
                        fontSizeMax: k,
                        fontSizeMin: L,
                        fontSizePrev: S,
                        calcKey: w
                      });
                    } else {
                      O.current = false;
                      W(false);
                      return f && f(R);
                    }
                  })();
                }
              })();
            } else {
              var o;
              var a = k;
              var r = L;
              (() => {
                if (t) {
                  o = (() => {
                    if (n) {
                      return S - R;
                    } else {
                      return L - R;
                    }
                  })();
                  return a = Math.min(k, R);
                } else {
                  o = (() => {
                    if (n) {
                      return k - R;
                    } else {
                      return S - R;
                    }
                  })();
                  return r = Math.max(L, R);
                }
              })();
              q({
                calcKey: w,
                fontSize: R + o / 2,
                fontSizeMax: a,
                fontSizeMin: r,
                fontSizePrev: R
              });
            }
          }
        }, [w, R, k, L, S, f, z, A]);
        return {
          fontSize: R + "%",
          ref: z,
          isCalculating: x
        };
      };
    }