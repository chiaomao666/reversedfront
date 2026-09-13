
      var o = n(73013);
      var a = n(39218);
      var r = n(28385);
      var i = n(89378);
      var s = n(11586);
      var c = i("IE_PROTO");
      var l = Object;
      var u = l.prototype;
      e.exports = (() => {
        if (s) {
          return l.getPrototypeOf;
        } else {
          return function (e) {
            var t = r(e);
            if (o(t, c)) {
              return t[c];
            }
            var n = t.constructor;
            return (() => {
              if (a(n) && t instanceof n) {
                return n.prototype;
              } else {
                return (() => {
                  if (t instanceof l) {
                    return u;
                  } else {
                    return null;
                  }
                })();
              }
            })();
          };
        }
      })();
    }