
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.default = undefined;
      var o = i(n(72791));
      var a = i(n(52007));
      var r = n(23363);
      function i(e) {
        return (() => {
          if (e && e.__esModule) {
            return e;
          } else {
            return {
              default: e
            };
          }
        })();
      }
      function s(e) {
        var t = e.getStyles;
        var n = e.cx;
        return o.default.createElement("div", {
          className: n("spinner", (0, r.css)(t("spinner")))
        }, o.default.createElement("svg", {
          viewBox: "25 25 50 50"
        }, o.default.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "20",
          fill: "none",
          strokeWidth: "2",
          strokeMiterlimit: "10"
        })));
      }
      s.propTypes = {
        getStyles: a.default.func.isRequired,
        cx: a.default.func.isRequired
      };
      var c = s;
      t.default = c;
    }