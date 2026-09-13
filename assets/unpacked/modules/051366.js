
      "use strict";

      t.__esModule = true;
      t.default = function (e, t) {
        return (() => {
          if (e.classList) {
            return !!t && e.classList.contains(t);
          } else {
            return (" " + (e.className.baseVal || e.className) + " ").indexOf(" " + t + " ") !== -1;
          }
        })();
      };
      e.exports = t.default;
    }