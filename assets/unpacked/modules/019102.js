
      var o = n(68150);
      var a = n(16194);
      var r = n(49494);
      var i = r && r.isTypedArray;
      var s = (() => {
        if (i) {
          return a(i);
        } else {
          return o;
        }
      })();
      e.exports = s;
    }