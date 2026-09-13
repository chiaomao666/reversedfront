
      var o = n(98513);
      var a = n(43931);
      var r = n(28287);
      var i = n(23863);
      var s = n(67772);
      var c = n(95028);
      var l = TypeError;
      var u = c("toPrimitive");
      e.exports = function (e, t) {
        if (!a(e) || r(e)) {
          return e;
        }
        var n;
        var c = i(e, u);
        if (c) {
          if (t === undefined) {
            t = "default";
          }
          n = o(c, e, t);
          if (!a(n) || r(n)) {
            return n;
          }
          throw l("Can't convert object to primitive value");
        }
        if (t === undefined) {
          t = "number";
        }
        return s(e, t);
      };
    }