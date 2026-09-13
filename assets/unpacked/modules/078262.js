
      "use strict";

      e.exports = function e(t, n) {
        if (t === n) {
          return true;
        }
        if (t && n && typeof t == "object" && typeof n == "object") {
          if (t.constructor !== n.constructor) {
            return false;
          }
          var o;
          var a;
          var r;
          if (Array.isArray(t)) {
            if ((o = t.length) != n.length) {
              return false;
            }
            for (a = o; a-- !== 0;) {
              if (!e(t[a], n[a])) {
                return false;
              }
            }
            return true;
          }
          if (t.constructor === RegExp) {
            return t.source === n.source && t.flags === n.flags;
          }
          if (t.valueOf !== Object.prototype.valueOf) {
            return t.valueOf() === n.valueOf();
          }
          if (t.toString !== Object.prototype.toString) {
            return t.toString() === n.toString();
          }
          if ((o = (r = Object.keys(t)).length) !== Object.keys(n).length) {
            return false;
          }
          for (a = o; a-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(n, r[a])) {
              return false;
            }
          }
          for (a = o; a-- !== 0;) {
            var i = r[a];
            if (!e(t[i], n[i])) {
              return false;
            }
          }
          return true;
        }
        return t !== t && n !== n;
      };
    }