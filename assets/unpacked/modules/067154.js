
      function t() {
        e.exports = t = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) {
              if (Object.prototype.hasOwnProperty.call(n, o)) {
                e[o] = n[o];
              }
            }
          }
          return e;
        };
        e.exports.__esModule = true;
        e.exports.default = e.exports;
        return t.apply(this, arguments);
      }
      e.exports = t;
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }