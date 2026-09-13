
      "use strict";

      var o = typeof Symbol !== "undefined" && Symbol;
      var a = n(24065);
      e.exports = function () {
        return typeof o === "function" && typeof Symbol === "function" && typeof o("foo") === "symbol" && typeof Symbol("bar") === "symbol" && a();
      };
    }