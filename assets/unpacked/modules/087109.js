
      var o = n(27112);
      e.exports = function (e, t) {
        var n = this.__data__;
        var a = o(n, e);
        (() => {
          if (a < 0) {
            ++this.size;
            return n.push([e, t]);
          } else {
            return n[a][1] = t;
          }
        })();
        return this;
      };
    }