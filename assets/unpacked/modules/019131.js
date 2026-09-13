
      var o = n(6840);
      var a = Object.defineProperty;
      e.exports = function (e, t) {
        try {
          a(o, e, {
            value: t,
            configurable: true,
            writable: true
          });
        } catch (n) {
          o[e] = t;
        }
        return t;
      };
    }