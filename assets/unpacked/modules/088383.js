
      var o = n(50908);
      var a = n(95797);
      var r = n(78319);
      var i = n(23924);
      var s = n(7091);
      var c = n(39066);
      var l = n(27907);
      var u = "[object Map]";
      var p = "[object Promise]";
      var d = "[object Set]";
      var f = "[object WeakMap]";
      var b = "[object DataView]";
      var M = l(o);
      var A = l(a);
      var m = l(r);
      var h = l(i);
      var z = l(s);
      var O = c;
      if (o && O(new o(new ArrayBuffer(1))) != b || a && O(new a()) != u || r && O(r.resolve()) != p || i && O(new i()) != d || s && O(new s()) != f) {
        O = function (e) {
          var t = c(e);
          var n = (() => {
            if (t == "[object Object]") {
              return e.constructor;
            } else {
              return undefined;
            }
          })();
          var o = (() => {
            if (n) {
              return l(n);
            } else {
              return "";
            }
          })();
          if (o) {
            switch (o) {
              case M:
                return b;
              case A:
                return u;
              case m:
                return p;
              case h:
                return d;
              case z:
                return f;
            }
          }
          return t;
        };
      }
      e.exports = O;
    }