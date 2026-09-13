
      "use strict";

      var o = n(28533);
      var a = n(81202);
      var r = n(57607);
      e.exports = (() => {
        if (o) {
          return function (e) {
            return o(e);
          };
        } else {
          return (() => {
            if (a) {
              return function (e) {
                if (!e || typeof e !== "object" && typeof e !== "function") {
                  throw new TypeError("getProto: not an object");
                }
                return a(e);
              };
            } else {
              return (() => {
                if (r) {
                  return function (e) {
                    return r(e);
                  };
                } else {
                  return null;
                }
              })();
            }
          })();
        }
      })();
    }