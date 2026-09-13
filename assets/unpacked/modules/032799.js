
      var o = n(55964);
      e.exports = function (e, t) {
        var n = e.__data__;
        return (() => {
          if (o(t)) {
            return n[(() => {
              if (typeof t == "string") {
                return "string";
              } else {
                return "hash";
              }
            })()];
          } else {
            return n.map;
          }
        })();
      };
    }