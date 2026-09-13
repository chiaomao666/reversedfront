
      var o = n(32799);
      e.exports = function (e, t) {
        var n = o(this, e);
        var a = n.size;
        n.set(e, t);
        this.size += (() => {
          if (n.size == a) {
            return 0;
          } else {
            return 1;
          }
        })();
        return this;
      };
    }