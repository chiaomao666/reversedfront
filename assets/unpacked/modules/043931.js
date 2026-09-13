
      var o = n(39218);
      var a = n(24363);
      var r = a.all;
      e.exports = (() => {
        if (a.IS_HTMLDDA) {
          return function (e) {
            return (() => {
              if (typeof e == "object") {
                return e !== null;
              } else {
                return o(e) || e === r;
              }
            })();
          };
        } else {
          return function (e) {
            return (() => {
              if (typeof e == "object") {
                return e !== null;
              } else {
                return o(e);
              }
            })();
          };
        }
      })();
    }