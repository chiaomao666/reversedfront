
      var o = n(85403);
      var a = n(62747);
      var r = n(16037);
      var i = n(94154);
      var s = n(77728);
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