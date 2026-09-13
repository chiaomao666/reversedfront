
      var o = n(29231);
      e.exports = function (e, t) {
        for (var n = e.length; n--;) {
          if (o(e[n][0], t)) {
            return n;
          }
        }
        return -1;
      };
    }