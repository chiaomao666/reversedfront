
      "use strict";

      var t = Object.defineProperty || false;
      if (t) {
        try {
          t({}, "a", {
            value: 1
          });
        } catch (n) {
          t = false;
        }
      }
      e.exports = t;
    }