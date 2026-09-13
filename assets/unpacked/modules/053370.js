
      var o = n(91592).f;
      var a = n(73013);
      var r = n(95028)("toStringTag");
      e.exports = function (e, t, n) {
        if (e && !n) {
          e = e.prototype;
        }
        if (e && !a(e, r)) {
          o(e, r, {
            configurable: true,
            value: t
          });
        }
      };
    }