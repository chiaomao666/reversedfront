
      "use strict";

      var o = n(67600).version;
      var a = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach(function (e, t) {
        a[e] = function (n) {
          return typeof n === e || "a" + (() => {
            if (t < 1) {
              return "n ";
            } else {
              return " ";
            }
          })() + e;
        };
      });
      var r = {};
      a.transitional = function (e, t, n) {
        function a(e, t) {
          return "[Axios v" + o + "] Transitional option '" + e + "'" + t + (() => {
            if (n) {
              return ". " + n;
            } else {
              return "";
            }
          })();
        }
        return function (n, o, i) {
          if (e === false) {
            throw new Error(a(o, " has been removed" + (() => {
              if (t) {
                return " in " + t;
              } else {
                return "";
              }
            })()));
          }
          if (t && !r[o]) {
            r[o] = true;
            console.warn(a(o, " has been deprecated since v" + t + " and will be removed in the near future"));
          }
          return !e || e(n, o, i);
        };
      };
      e.exports = {
        assertOptions: function (e, t, n) {
          if (typeof e !== "object") {
            throw new TypeError("options must be an object");
          }
          var o = Object.keys(e);
          for (var a = o.length; a-- > 0;) {
            var r = o[a];
            var i = t[r];
            if (i) {
              var s = e[r];
              var c = s === undefined || i(s, r, e);
              if (c !== true) {
                throw new TypeError("option " + r + " must be " + c);
              }
            } else if (n !== true) {
              throw Error("Unknown option " + r);
            }
          }
        },
        validators: a
      };
    }