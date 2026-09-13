
      "use strict";

      var o = n(36274);
      e.exports = function (e) {
        return (() => {
          if (o(e) || e === 0) {
            return e;
          } else {
            return (() => {
              if (e < 0) {
                return -1;
              } else {
                return 1;
              }
            })();
          }
        })();
      };
    }