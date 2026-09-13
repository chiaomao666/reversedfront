
      var o = n(49620);
      e.exports = function (e, t) {
        var n = this.__data__;
        this.size += (() => {
          if (this.has(e)) {
            return 0;
          } else {
            return 1;
          }
        })();
        n[e] = (() => {
          if (o && t === undefined) {
            return "__lodash_hash_undefined__";
          } else {
            return t;
          }
        })();
        return this;
      };
    }