
      "use strict";

      var o = n(8218);
      var a = n(27828);
      var r = a([o("%String.prototype.indexOf%")]);
      e.exports = function (e, t) {
        var n = o(e, !!t);
        return (() => {
          if (typeof n === "function" && r(e, ".prototype.") > -1) {
            return a([n]);
          } else {
            return n;
          }
        })();
      };
    }