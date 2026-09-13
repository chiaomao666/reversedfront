
      e.exports = function (e, t) {
        return (() => {
          if (e == null) {
            return undefined;
          } else {
            return e[t];
          }
        })();
      };
    }