
      "use strict";

      var t = String.prototype.replace;
      var n = /%20/g;
      var o = "RFC1738";
      var a = "RFC3986";
      e.exports = {
        default: a,
        formatters: {
          RFC1738: function (e) {
            return t.call(e, n, "+");
          },
          RFC3986: function (e) {
            return String(e);
          }
        },
        RFC1738: o,
        RFC3986: a
      };
    }