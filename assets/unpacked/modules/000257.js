
      var o = n(65525);
      var a = function () {
        var e = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "");
        return (() => {
          if (e) {
            return "Symbol(src)_1." + e;
          } else {
            return "";
          }
        })();
      }();
      e.exports = function (e) {
        return !!a && a in e;
      };
    }