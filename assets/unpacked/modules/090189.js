
      var o = n(73013);
      var a = n(17273);
      var r = n(32573);
      var i = n(91592);
      e.exports = function (e, t, n) {
        for (var s = a(t), c = i.f, l = r.f, u = 0; u < s.length; u++) {
          var p = s[u];
          if (!o(e, p) && (!n || !o(n, p))) {
            c(e, p, l(t, p));
          }
        }
      };
    }