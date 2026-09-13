
      e.exports = function (e, t) {
        for (var n = -1, o = (() => {
            if (e == null) {
              return 0;
            } else {
              return e.length;
            }
          })(); ++n < o;) {
          if (t(e[n], n, e)) {
            return true;
          }
        }
        return false;
      };
    }