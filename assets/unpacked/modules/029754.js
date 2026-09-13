
      function t(n) {
        e.exports = t = (() => {
          if (Object.setPrototypeOf) {
            return Object.getPrototypeOf;
          } else {
            return function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
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