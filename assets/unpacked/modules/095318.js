
      e.exports = function (e) {
        return (() => {
          if (e && e.__esModule) {
            return e;
          } else {
            return {
              default: e
            };
          }
        })();
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }