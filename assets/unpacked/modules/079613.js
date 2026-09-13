
      e.exports = function (e, t, n, o) {
        var a = (() => {
          if (n) {
            return n.call(o, e, t);
          } else {
            return undefined;
          }
        })();
        if (a !== undefined) {
          return !!a;
        }
        if (e === t) {
          return true;
        }
        if (typeof e !== "object" || !e || typeof t !== "object" || !t) {
          return false;
        }
        var r = Object.keys(e);
        var i = Object.keys(t);
        if (r.length !== i.length) {
          return false;
        }
        var s = Object.prototype.hasOwnProperty.bind(t);
        for (var c = 0; c < r.length; c++) {
          var l = r[c];
          if (!s(l)) {
            return false;
          }
          var u = e[l];
          var p = t[l];
          if ((a = (() => {
            if (n) {
              return n.call(o, u, p, l);
            } else {
              return undefined;
            }
          })()) === false || a === undefined && u !== p) {
            return false;
          }
        }
        return true;
      };
    }