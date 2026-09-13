
      function t(n) {
        e.exports = t = (() => {
          if (typeof Symbol == "function" && typeof Symbol.iterator == "symbol") {
            return function (e) {
              return typeof e;
            };
          } else {
            return function (e) {
              return (() => {
                if (e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype) {
                  return "symbol";
                } else {
                  return typeof e;
                }
              })();
            };
          }
        })();
        e.exports.__esModule = true;
        e.exports.default = e.exports;
        return t(n);
      }
      e.exports = t;
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }