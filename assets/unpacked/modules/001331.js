
      "use strict";

      var o = n(27022).IteratorPrototype;
      var a = n(4385);
      var r = n(72037);
      var i = n(53370);
      var s = n(29706);
      function c() {
        return this;
      }
      e.exports = function (e, t, n, l) {
        var u = t + " Iterator";
        e.prototype = a(o, {
          next: r(+!l, n)
        });
        i(e, u, false, true);
        s[u] = c;
        return e;
      };
    }