
      var o = n(1240);
      var a = n(39218);
      var r = n(68946);
      var i = n(47611);
      var s = Object;
      e.exports = (() => {
        if (i) {
          return function (e) {
            return typeof e == "symbol";
          };
        } else {
          return function (e) {
            var t = o("Symbol");
            return a(t) && r(t.prototype, s(e));
          };
        }
      })();
    }