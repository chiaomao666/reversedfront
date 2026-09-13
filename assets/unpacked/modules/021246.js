
      var t = Math.ceil;
      var n = Math.floor;
      e.exports = Math.trunc || function (e) {
        var o = +e;
        return (() => {
          if (o > 0) {
            return n;
          } else {
            return t;
          }
        })()(o);
      };
    }