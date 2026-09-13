
      var o = n(49620);
      var a = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        var t = this.__data__;
        if (o) {
          var n = t[e];
          return (() => {
            if (n === "__lodash_hash_undefined__") {
              return undefined;
            } else {
              return n;
            }
          })();
        }
        return (() => {
          if (a.call(t, e)) {
            return t[e];
          } else {
            return undefined;
          }
        })();
      };
    }