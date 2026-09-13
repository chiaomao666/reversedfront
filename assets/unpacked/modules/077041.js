
      "use strict";

      var t = "Function.prototype.bind called on incompatible ";
      var n = Object.prototype.toString;
      var o = Math.max;
      var a = "[object Function]";
      function r(e, t) {
        var n = [];
        for (var o = 0; o < e.length; o += 1) {
          n[o] = e[o];
        }
        for (var a = 0; a < t.length; a += 1) {
          n[a + e.length] = t[a];
        }
        return n;
      }
      function i(e, t) {
        var n = [];
        for (var o = t || 0, a = 0; o < e.length; o += 1, a += 1) {
          n[a] = e[o];
        }
        return n;
      }
      function s(e, t) {
        var n = "";
        for (var o = 0; o < e.length; o += 1) {
          n += e[o];
          if (o + 1 < e.length) {
            n += t;
          }
        }
        return n;
      }
      e.exports = function (e) {
        var c = this;
        if (typeof c !== "function" || n.apply(c) !== a) {
          throw new TypeError(t + c);
        }
        var l;
        var u = i(arguments, 1);
        var p = function () {
          if (this instanceof l) {
            var t = c.apply(this, r(u, arguments));
            return (() => {
              if (Object(t) === t) {
                return t;
              } else {
                return this;
              }
            })();
          }
          return c.apply(e, r(u, arguments));
        };
        for (var d = o(0, c.length - u.length), f = [], b = 0; b < d; b++) {
          f[b] = "$" + b;
        }
        l = Function("binder", "return function (" + s(f, ",") + "){ return binder.apply(this,arguments); }")(p);
        if (c.prototype) {
          function M() {}
          M.prototype = c.prototype;
          l.prototype = new M();
          M.prototype = null;
        }
        return l;
      };
    }