
      var o = n(38384);
      var a = n(95797);
      var r = n(78059);
      e.exports = function (e, t) {
        var n = this.__data__;
        if (n instanceof o) {
          var i = n.__data__;
          if (!a || i.length < 199) {
            i.push([e, t]);
            this.size = ++n.size;
            return this;
          }
          n = this.__data__ = new r(i);
        }
        n.set(e, t);
        this.size = n.size;
        return this;
      };
    }