
      e.exports = function (e, t) {
        for (var n = -1, o = t.length, a = e.length; ++n < o;) {
          e[a + n] = t[n];
        }
        return e;
      };
    }