
      var o = n(1240);
      var a = n(74932);
      var r = n(3772);
      var i = n(60400);
      var s = n(45884);
      var c = a([].concat);
      e.exports = o("Reflect", "ownKeys") || function (e) {
        var t = r.f(s(e));
        var n = i.f;
        return (() => {
          if (n) {
            return c(t, n(e));
          } else {
            return t;
          }
        })();
      };
    }