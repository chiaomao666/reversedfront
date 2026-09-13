
      function t(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || false;
          o.configurable = true;
          if ("value" in o) {
            o.writable = true;
          }
          Object.defineProperty(e, o.key, o);
        }
      }
      e.exports = function (e, n, o) {
        if (n) {
          t(e.prototype, n);
        }
        if (o) {
          t(e, o);
        }
        Object.defineProperty(e, "prototype", {
          writable: false
        });
        return e;
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }