
      var o = n(45770);
      var a = n(41823);
      var r = n(23385);
      function i(e) {
        return function (t, n, i) {
          var s;
          var c = o(t);
          var l = r(c);
          var u = a(i, l);
          if (e && n != n) {
            while (l > u) {
              if ((s = c[u++]) != s) {
                return true;
              }
            }
          } else {
            for (; l > u; u++) {
              if ((e || u in c) && c[u] === n) {
                return e || u || 0;
              }
            }
          }
          return !e && -1;
        };
      }
      e.exports = {
        includes: i(true),
        indexOf: i(false)
      };
    }