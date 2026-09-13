
      var o = n(87197);
      var a = Object.prototype;
      var r = a.hasOwnProperty;
      var i = a.toString;
      var s = (() => {
        if (o) {
          return o.toStringTag;
        } else {
          return undefined;
        }
      })();
      e.exports = function (e) {
        var t = r.call(e, s);
        var n = e[s];
        try {
          e[s] = undefined;
          var o = true;
        } catch (c) {}
        var a = i.call(e);
        if (o) {
          (() => {
            if (t) {
              return e[s] = n;
            } else {
              return delete e[s];
            }
          })();
        }
        return a;
      };
    }