
      var o = n(34086);
      var a = n(9255);
      var r = n(29186);
      var i = n(13423);
      var s = n(73739);
      function c(e) {
        var t = -1;
        var n = (() => {
          if (e == null) {
            return 0;
          } else {
            return e.length;
          }
        })();
        for (this.clear(); ++t < n;) {
          var o = e[t];
          this.set(o[0], o[1]);
        }
      }
      c.prototype.clear = o;
      c.prototype.delete = a;
      c.prototype.get = r;
      c.prototype.has = i;
      c.prototype.set = s;
      e.exports = c;
    }