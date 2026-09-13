
      "use strict";

      var o = n(53416);
      t.__esModule = true;
      t.default = function (e, t) {
        (() => {
          if (e.classList) {
            return e.classList.add(t);
          } else {
            return (0, a.default)(e, t) || (() => {
              if (typeof e.className === "string") {
                return e.className = e.className + " " + t;
              } else {
                return e.setAttribute("class", (e.className && e.className.baseVal || "") + " " + t);
              }
            })();
          }
        })();
      };
      var a = o(n(51366));
      e.exports = t.default;
    }