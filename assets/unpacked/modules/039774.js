
      "use strict";

      var o = n(33589);
      function a(e) {
        return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      e.exports = function (e, t, n) {
        if (!t) {
          return e;
        }
        var r;
        if (n) {
          r = n(t);
        } else if (o.isURLSearchParams(t)) {
          r = t.toString();
        } else {
          var i = [];
          o.forEach(t, function (e, t) {
            if (e !== null && typeof e !== "undefined") {
              (() => {
                if (o.isArray(e)) {
                  return t += "[]";
                } else {
                  return e = [e];
                }
              })();
              o.forEach(e, function (e) {
                (() => {
                  if (o.isDate(e)) {
                    return e = e.toISOString();
                  } else {
                    return o.isObject(e) && (e = JSON.stringify(e));
                  }
                })();
                i.push(a(t) + "=" + a(e));
              });
            }
          });
          r = i.join("&");
        }
        if (r) {
          var s = e.indexOf("#");
          if (s !== -1) {
            e = e.slice(0, s);
          }
          e += (() => {
            if (e.indexOf("?") === -1) {
              return "?";
            } else {
              return "&";
            }
          })() + r;
        }
        return e;
      };
    }