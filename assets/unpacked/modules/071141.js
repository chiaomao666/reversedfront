
      var n = Object.prototype.hasOwnProperty;
      t.dequal = function e(t, o) {
        var a;
        var r;
        if (t === o) {
          return true;
        }
        if (t && o && (a = t.constructor) === o.constructor) {
          if (a === Date) {
            return t.getTime() === o.getTime();
          }
          if (a === RegExp) {
            return t.toString() === o.toString();
          }
          if (a === Array) {
            if ((r = t.length) === o.length) {
              while (r-- && e(t[r], o[r]));
            }
            return r === -1;
          }
          if (!a || typeof t === "object") {
            r = 0;
            for (a in t) {
              if (n.call(t, a) && ++r && !n.call(o, a)) {
                return false;
              }
              if (!(a in o) || !e(t[a], o[a])) {
                return false;
              }
            }
            return Object.keys(o).length === r;
          }
        }
        return t !== t && o !== o;
      };
    }