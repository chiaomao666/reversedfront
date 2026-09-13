
      "use strict";

      var o = n(33589);
      e.exports = (() => {
        if (o.isStandardBrowserEnv()) {
          return function () {
            var e;
            var t = /(msie|trident)/i.test(navigator.userAgent);
            var n = document.createElement("a");
            function a(e) {
              var o = e;
              if (t) {
                n.setAttribute("href", o);
                o = n.href;
              }
              n.setAttribute("href", o);
              return {
                href: n.href,
                protocol: (() => {
                  if (n.protocol) {
                    return n.protocol.replace(/:$/, "");
                  } else {
                    return "";
                  }
                })(),
                host: n.host,
                search: (() => {
                  if (n.search) {
                    return n.search.replace(/^\?/, "");
                  } else {
                    return "";
                  }
                })(),
                hash: (() => {
                  if (n.hash) {
                    return n.hash.replace(/^#/, "");
                  } else {
                    return "";
                  }
                })(),
                hostname: n.hostname,
                port: n.port,
                pathname: (() => {
                  if (n.pathname.charAt(0) === "/") {
                    return n.pathname;
                  } else {
                    return "/" + n.pathname;
                  }
                })()
              };
            }
            e = a(window.location.href);
            return function (t) {
              var n = (() => {
                if (o.isString(t)) {
                  return a(t);
                } else {
                  return t;
                }
              })();
              return n.protocol === e.protocol && n.host === e.host;
            };
          }();
        } else {
          return function () {
            return true;
          };
        }
      })();
    }