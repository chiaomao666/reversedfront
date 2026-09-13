
      e.exports = function (e, t) {
        for (var n = -1, o = Array(e); ++n < e;) {
          o[n] = t(n);
        }
        return o;
      };
    }