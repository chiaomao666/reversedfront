
      "use strict";

      var o = n(33589);
      var a = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      e.exports = function (e) {
        var t;
        var n;
        var r;
        var i = {};
        return (() => {
          if (e) {
            o.forEach(e.split("\n"), function (e) {
              r = e.indexOf(":");
              t = o.trim(e.substr(0, r)).toLowerCase();
              n = o.trim(e.substr(r + 1));
              if (t) {
                if (i[t] && a.indexOf(t) >= 0) {
                  return;
                }
                i[t] = (() => {
                  if (t === "set-cookie") {
                    return (() => {
                      if (i[t]) {
                        return i[t];
                      } else {
                        return [];
                      }
                    })().concat([n]);
                  } else {
                    return (() => {
                      if (i[t]) {
                        return i[t] + ", " + n;
                      } else {
                        return n;
                      }
                    })();
                  }
                })();
              }
            });
            return i;
          } else {
            return i;
          }
        })();
      };
    }