
      "use strict";

      var o = n(33589);
      var a = n(50221);
      e.exports = function (e, t, n) {
        var r = this || a;
        o.forEach(n, function (n) {
          e = n.call(r, e, t);
        });
        return e;
      };
    }