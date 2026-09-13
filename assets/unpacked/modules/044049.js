
      "use strict";

      e.exports = function (e, t) {
        return function () {
          for (var n = new Array(arguments.length), o = 0; o < n.length; o++) {
            n[o] = arguments[o];
          }
          return e.apply(t, n);
        };
      };
    }