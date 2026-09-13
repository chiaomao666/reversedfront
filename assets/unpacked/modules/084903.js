
      e.exports = function (e, t) {
        for (var n = -1, o = (() => {
            if (e == null) {
              return 0;
            } else {
              return e.length;
            }
          })(), a = 0, r = []; ++n < o;) {
          var i = e[n];
          if (t(i, n, e)) {
            r[a++] = i;
          }
        }
        return r;
      };
    }