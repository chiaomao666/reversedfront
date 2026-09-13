
      var o = n(50008).default;
      var a = n(81506);
      e.exports = function (e, t) {
        if (t && (o(t) === "object" || typeof t === "function")) {
          return t;
        }
        if (t !== undefined) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return a(e);
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }