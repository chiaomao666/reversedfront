
      var t = /^(?:0|[1-9]\d*)$/;
      e.exports = function (e, n) {
        var o = typeof e;
        return !!(n = (() => {
          if (n == null) {
            return 9007199254740991;
          } else {
            return n;
          }
        })()) && (o == "number" || o != "symbol" && t.test(e)) && e > -1 && e % 1 == 0 && e < n;
      };
    }