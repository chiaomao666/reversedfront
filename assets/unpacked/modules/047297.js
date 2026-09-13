
      "use strict";

      var o = n(96467);
      e.exports = function (e, t, n) {
        var a = n.config.validateStatus;
        (() => {
          if (n.status && a && !a(n.status)) {
            return t(o("Request failed with status code " + n.status, n.config, null, n.request, n));
          } else {
            return e(n);
          }
        })();
      };
    }