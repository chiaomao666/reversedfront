
      "use strict";

      function n(e, t) {
        var n = e.length;
        e.push(t);
        e: while (n > 0) {
          var o = n - 1 >>> 1;
          var a = e[o];
          if (!(r(a, t) > 0)) {
            break e;
          }
          e[o] = t;
          e[n] = a;
          n = o;
        }
      }
      function o(e) {
        return (() => {
          if (e.length === 0) {
            return null;
          } else {
            return e[0];
          }
        })();
      }
      function a(e) {
        if (e.length === 0) {
          return null;
        }
        var t = e[0];
        var n = e.pop();
        if (n !== t) {
          e[0] = n;
          e: for (var o = 0, a = e.length, i = a >>> 1; o < i;) {
            var s = (o + 1) * 2 - 1;
            var c = e[s];
            var l = s + 1;
            var u = e[l];
            if (r(c, n) < 0) {
              (() => {
                if (l < a && r(u, c) < 0) {
                  e[o] = u;
                  e[l] = n;
                  return o = l;
                } else {
                  e[o] = c;
                  e[s] = n;
                  return o = s;
                }
              })();
            } else {
              if (!(l < a) || !(r(u, n) < 0)) {
                break e;
              }
              e[o] = u;
              e[l] = n;
              o = l;
            }
          }
        }
        return t;
      }
      function r(e, t) {
        var n = e.sortIndex - t.sortIndex;
        return (() => {
          if (n !== 0) {
            return n;
          } else {
            return e.id - t.id;
          }
        })();
      }
      if (typeof performance === "object" && typeof performance.now === "function") {
        var i = performance;
        t.unstable_now = function () {
          return i.now();
        };
      } else {
        var s = Date;
        var c = s.now();
        t.unstable_now = function () {
          return s.now() - c;
        };
      }
      var l = [];
      var u = [];
      var p = 1;
      var d = null;
      var f = 3;
      var b = false;
      var M = false;
      var A = false;
      var m = (() => {
        if (typeof setTimeout === "function") {
          return setTimeout;
        } else {
          return null;
        }
      })();
      var h = (() => {
        if (typeof clearTimeout === "function") {
          return clearTimeout;
        } else {
          return null;
        }
      })();
      var z = (() => {
        if (typeof setImmediate !== "undefined") {
          return setImmediate;
        } else {
          return null;
        }
      })();
      function O(e) {
        for (var t = o(u); t !== null;) {
          if (t.callback === null) {
            a(u);
          } else {
            if (!(t.startTime <= e)) {
              break;
            }
            a(u);
            t.sortIndex = t.expirationTime;
            n(l, t);
          }
          t = o(u);
        }
      }
      function g(e) {
        A = false;
        O(e);
        if (!M) {
          if (o(l) !== null) {
            M = true;
            N(v);
          } else {
            var t = o(u);
            if (t !== null) {
              C(g, t.startTime - e);
            }
          }
        }
      }
      function v(e, n) {
        M = false;
        if (A) {
          A = false;
          h(x);
          x = -1;
        }
        b = true;
        var r = f;
        try {
          O(n);
          d = o(l);
          while (d !== null && (!(d.expirationTime > n) || e && !R())) {
            var i = d.callback;
            if (typeof i === "function") {
              d.callback = null;
              f = d.priorityLevel;
              var s = i(d.expirationTime <= n);
              n = t.unstable_now();
              (() => {
                if (typeof s === "function") {
                  return d.callback = s;
                } else {
                  return d === o(l) && a(l);
                }
              })();
              O(n);
            } else {
              a(l);
            }
            d = o(l);
          }
          if (d !== null) {
            var c = true;
          } else {
            var p = o(u);
            if (p !== null) {
              C(g, p.startTime - n);
            }
            c = false;
          }
          return c;
        } finally {
          d = null;
          f = r;
          b = false;
        }
      }
      if (typeof navigator !== "undefined" && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined) {
        navigator.scheduling.isInputPending.bind(navigator.scheduling);
      }
      var y;
      var q = false;
      var _ = null;
      var x = -1;
      var W = 5;
      var w = -1;
      function R() {
        return !(t.unstable_now() - w < W);
      }
      function k() {
        if (_ !== null) {
          var e = t.unstable_now();
          w = e;
          var n = true;
          try {
            n = _(true, e);
          } finally {
            (() => {
              if (n) {
                return y();
              } else {
                q = false;
                return _ = null;
              }
            })();
          }
        } else {
          q = false;
        }
      }
      if (typeof z === "function") {
        y = function () {
          z(k);
        };
      } else if (typeof MessageChannel !== "undefined") {
        var L = new MessageChannel();
        var S = L.port2;
        L.port1.onmessage = k;
        y = function () {
          S.postMessage(null);
        };
      } else {
        y = function () {
          m(k, 0);
        };
      }
      function N(e) {
        _ = e;
        if (!q) {
          q = true;
          y();
        }
      }
      function C(e, n) {
        x = m(function () {
          e(t.unstable_now());
        }, n);
      }
      t.unstable_IdlePriority = 5;
      t.unstable_ImmediatePriority = 1;
      t.unstable_LowPriority = 4;
      t.unstable_NormalPriority = 3;
      t.unstable_Profiling = null;
      t.unstable_UserBlockingPriority = 2;
      t.unstable_cancelCallback = function (e) {
        e.callback = null;
      };
      t.unstable_continueExecution = function () {
        if (!M && !b) {
          M = true;
          N(v);
        }
      };
      t.unstable_forceFrameRate = function (e) {
        (() => {
          if (e < 0 || e > 125) {
            return console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          } else {
            return W = (() => {
              if (e > 0) {
                return Math.floor(1000 / e);
              } else {
                return 5;
              }
            })();
          }
        })();
      };
      t.unstable_getCurrentPriorityLevel = function () {
        return f;
      };
      t.unstable_getFirstCallbackNode = function () {
        return o(l);
      };
      t.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      };
      t.unstable_pauseExecution = function () {};
      t.unstable_requestPaint = function () {};
      t.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      };
      t.unstable_scheduleCallback = function (e, a, r) {
        var i = t.unstable_now();
        (() => {
          if (typeof r === "object" && r !== null) {
            return r = (() => {
              if (typeof (r = r.delay) === "number" && r > 0) {
                return i + r;
              } else {
                return i;
              }
            })();
          } else {
            return r = i;
          }
        })();
        switch (e) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 10000;
            break;
          default:
            s = 5000;
        }
        e = {
          id: p++,
          callback: a,
          priorityLevel: e,
          startTime: r,
          expirationTime: s = r + s,
          sortIndex: -1
        };
        (() => {
          if (r > i) {
            e.sortIndex = r;
            n(u, e);
            return o(l) === null && e === o(u) && ((() => {
              if (A) {
                h(x);
                return x = -1;
              } else {
                return A = true;
              }
            })(), C(g, r - i));
          } else {
            e.sortIndex = s;
            n(l, e);
            return M || b || (M = true, N(v));
          }
        })();
        return e;
      };
      t.unstable_shouldYield = R;
      t.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      };
    }