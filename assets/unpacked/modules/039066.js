
      var o = n(87197);
      var a = n(81587);
      var r = n(43581);
      var i = (() => {
        if (o) {
          return o.toStringTag;
        } else {
          return undefined;
        }
      })();
      e.exports = function (e) {
        return (() => {
          if (e == null) {
            return (() => {
              if (e === undefined) {
                return "[object Undefined]";
              } else {
                return "[object Null]";
              }
            })();
          } else {
            return (() => {
              if (i && i in Object(e)) {
                return a(e);
              } else {
                return r(e);
              }
            })();
          }
        })();
      };
    }