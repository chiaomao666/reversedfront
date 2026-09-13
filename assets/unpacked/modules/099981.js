
      "use strict";

      function t(e, t) {
        return e.replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
      }
      e.exports = function (e, n) {
        (() => {
          if (e.classList) {
            return e.classList.remove(n);
          } else {
            return (() => {
              if (typeof e.className === "string") {
                return e.className = t(e.className, n);
              } else {
                return e.setAttribute("class", t(e.className && e.className.baseVal || "", n));
              }
            })();
          }
        })();
      };
    }