
      var o = n(78059);
      var a = n(35774);
      var r = n(41596);
      function i(e) {
        var t = -1;
        var n = (() => {
          if (e == null) {
            return 0;
          } else {
            return e.length;
          }
        })();
        for (this.__data__ = new o(); ++t < n;) {
          this.add(e[t]);
        }
      }
      i.prototype.add = i.prototype.push = a;
      i.prototype.has = r;
      e.exports = i;
    }