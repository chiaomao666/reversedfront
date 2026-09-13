
      var o = n(32799);
      e.exports = function (e) {
        var t = o(this, e).delete(e);
        this.size -= (() => {
          if (t) {
            return 1;
          } else {
            return 0;
          }
        })();
        return t;
      };
    }