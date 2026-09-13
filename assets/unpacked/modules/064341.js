
      "use strict";

      var o = n(33589);
      e.exports = function (e, t) {
        o.forEach(e, function (n, o) {
          if (o !== t && o.toUpperCase() === t.toUpperCase()) {
            e[t] = n;
            delete e[o];
          }
        });
      };
    }