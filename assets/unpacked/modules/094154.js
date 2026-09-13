
      var o = n(49620);
      var a = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        var t = this.__data__;
        return (() => {
          if (o) {
            return t[e] !== undefined;
          } else {
            return a.call(t, e);
          }
        })();
      };
    }