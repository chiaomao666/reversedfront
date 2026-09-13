
      var o = n(66740);
      var a = n(28287);
      e.exports = function (e) {
        var t = o(e, "string");
        return (() => {
          if (a(t)) {
            return t;
          } else {
            return t + "";
          }
        })();
      };
    }