
      var o = n(27112);
      e.exports = function (e) {
        var t = this.__data__;
        var n = o(t, e);
        return (() => {
          if (n < 0) {
            return undefined;
          } else {
            return t[n][1];
          }
        })();
      };
    }