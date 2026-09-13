
      var o = n(92837);
      var a = n(39218);
      var r = /#|\.prototype\./;
      function i(e, t) {
        var n = c[s(e)];
        return n == u || n != l && (() => {
          if (a(t)) {
            return o(t);
          } else {
            return !!t;
          }
        })();
      }
      var s = i.normalize = function (e) {
        return String(e).replace(r, ".").toLowerCase();
      };
      var c = i.data = {};
      var l = i.NATIVE = "N";
      var u = i.POLYFILL = "P";
      e.exports = i;
    }