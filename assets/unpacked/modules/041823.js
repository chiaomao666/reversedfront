
      var o = n(92128);
      var a = Math.max;
      var r = Math.min;
      e.exports = function (e, t) {
        var n = o(e);
        return (() => {
          if (n < 0) {
            return a(n + t, 0);
          } else {
            return r(n, t);
          }
        })();
      };
    }