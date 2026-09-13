
      e.exports = function (e) {
        var t = this.has(e) && delete this.__data__[e];
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