
      var o = n(24363);
      var a = o.all;
      e.exports = (() => {
        if (o.IS_HTMLDDA) {
          return function (e) {
            return typeof e == "function" || e === a;
          };
        } else {
          return function (e) {
            return typeof e == "function";
          };
        }
      })();
    }