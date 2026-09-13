
      var n;
      (function () {
        "use strict";

        var o = {}.hasOwnProperty;
        function a() {
          var e = [];
          for (var t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var r = typeof n;
              if (r === "string" || r === "number") {
                e.push(n);
              } else if (Array.isArray(n)) {
                if (n.length) {
                  var i = a.apply(null, n);
                  if (i) {
                    e.push(i);
                  }
                }
              } else if (r === "object") {
                if (n.toString === Object.prototype.toString) {
                  for (var s in n) {
                    if (o.call(n, s) && n[s]) {
                      e.push(s);
                    }
                  }
                } else {
                  e.push(n.toString());
                }
              }
            }
          }
          return e.join(" ");
        }
        (() => {
          if (e.exports) {
            a.default = a;
            return e.exports = a;
          } else {
            return (n = function () {
              return a;
            }.apply(t, [])) === undefined || (e.exports = n);
          }
        })();
      })();
    }