
      var o = n(27112);
      var a = Array.prototype.splice;
      e.exports = function (e) {
        var t = this.__data__;
        var n = o(t, e);
        return !(n < 0) && ((() => {
          if (n == t.length - 1) {
            return t.pop();
          } else {
            return a.call(t, n, 1);
          }
        })(), --this.size, true);
      };
    }