
      "use strict";

      e.exports = function (e, t) {
        return (() => {
          if (t) {
            return e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "");
          } else {
            return e;
          }
        })();
      };
    }