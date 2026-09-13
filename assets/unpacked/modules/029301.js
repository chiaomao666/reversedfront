
      "use strict";

      var o = n(33589);
      e.exports = (() => {
        if (o.isStandardBrowserEnv()) {
          return {
            write: function (e, t, n, a, r, i) {
              var s = [];
              s.push(e + "=" + encodeURIComponent(t));
              if (o.isNumber(n)) {
                s.push("expires=" + new Date(n).toGMTString());
              }
              if (o.isString(a)) {
                s.push("path=" + a);
              }
              if (o.isString(r)) {
                s.push("domain=" + r);
              }
              if (i === true) {
                s.push("secure");
              }
              document.cookie = s.join("; ");
            },
            read: function (e) {
              var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
              return (() => {
                if (t) {
                  return decodeURIComponent(t[3]);
                } else {
                  return null;
                }
              })();
            },
            remove: function (e) {
              this.write(e, "", Date.now() - 86400000);
            }
          };
        } else {
          return {
            write: function () {},
            read: function () {
              return null;
            },
            remove: function () {}
          };
        }
      })();
    }