
      var o = n(6840);
      var a = n(39218);
      function r(e) {
        return (() => {
          if (a(e)) {
            return e;
          } else {
            return undefined;
          }
        })();
      }
      e.exports = function (e, t) {
        return (() => {
          if (arguments.length < 2) {
            return r(o[e]);
          } else {
            return o[e] && o[e][t];
          }
        })();
      };
    }