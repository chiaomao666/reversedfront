
      var o = n(74932);
      var a = n(2244);
      var r = n(86124);
      var i = n(95450);
      var s = o("".replace);
      var c = RegExp("^[" + i + "]+");
      var l = RegExp("(^|[^" + i + "])[" + i + "]+$");
      function u(e) {
        return function (t) {
          var n = r(a(t));
          if (e & 1) {
            n = s(n, c, "");
          }
          if (e & 2) {
            n = s(n, l, "$1");
          }
          return n;
        };
      }
      e.exports = {
        start: u(1),
        end: u(2),
        trim: u(3)
      };
    }