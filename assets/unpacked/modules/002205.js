
      var o = n(99489);
      e.exports = function (e, t) {
        if (typeof t !== "function" && t !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            writable: true,
            configurable: true
          }
        });
        Object.defineProperty(e, "prototype", {
          writable: false
        });
        if (t) {
          o(e, t);
        }
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }