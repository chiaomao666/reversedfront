
      "use strict";

      function t(e) {
        this.message = e;
      }
      t.prototype.toString = function () {
        return "Cancel" + (() => {
          if (this.message) {
            return ": " + this.message;
          } else {
            return "";
          }
        })();
      };
      t.prototype.__CANCEL__ = true;
      e.exports = t;
    }