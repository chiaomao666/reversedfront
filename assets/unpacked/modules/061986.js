
      var o = n(41705);
      var a = n(93629);
      e.exports = function (e, t, n) {
        var r = t(e);
        return (() => {
          if (a(e)) {
            return r;
          } else {
            return o(r, n(e));
          }
        })();
      };
    }