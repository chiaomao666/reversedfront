
      e.exports = function (e) {
        if (e === undefined) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }