
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.default = undefined;
      var o = n(23363);
      function a(e, t, n) {
        (() => {
          if (t in e) {
            return Object.defineProperty(e, t, {
              value: n,
              enumerable: true,
              configurable: true,
              writable: true
            });
          } else {
            return e[t] = n;
          }
        })();
        return e;
      }
      function r() {
        var e = s(["\n  0% {\n    stroke-dasharray: 1,200;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -35px;\n  }\n  100% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -124px;\n  }\n"]);
        r = function () {
          return e;
        };
        return e;
      }
      function i() {
        var e = s(["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n"]);
        i = function () {
          return e;
        };
        return e;
      }
      function s(e, t) {
        t ||= e.slice(0);
        return Object.freeze(Object.defineProperties(e, {
          raw: {
            value: Object.freeze(t)
          }
        }));
      }
      var c = (0, o.keyframes)(i());
      var l = (0, o.keyframes)(r());
      var u = {
        wrapper: function (e) {
          return function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = (() => {
                if (arguments[t] != null) {
                  return arguments[t];
                } else {
                  return {};
                }
              })();
              var o = Object.keys(n);
              if (typeof Object.getOwnPropertySymbols === "function") {
                o = o.concat(Object.getOwnPropertySymbols(n).filter(function (e) {
                  return Object.getOwnPropertyDescriptor(n, e).enumerable;
                }));
              }
              o.forEach(function (t) {
                a(e, t, n[t]);
              });
            }
            return e;
          }({
            position: "relative"
          }, e);
        },
        overlay: function (e, t) {
          return {
            position: "absolute",
            height: "100%",
            width: "100%",
            top: "0px",
            left: "0px",
            display: "flex",
            textAlign: "center",
            fontSize: "1.2em",
            color: "#FFF",
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 800,
            transition: `opacity ${t.fadeSpeed}ms ease-in`,
            opacity: (() => {
              if (e === "entering" || e === "entered") {
                return 1;
              } else {
                return 0;
              }
            })()
          };
        },
        content: function () {
          return {
            margin: "auto"
          };
        },
        spinner: function (e) {
          return {
            position: "relative",
            margin: "0px auto 10px auto",
            width: "50px",
            maxHeight: "100%",
            "&:before": {
              content: "\"\"",
              display: "block",
              paddingTop: "100%"
            },
            "& svg": {
              animation: `${c} 2s linear infinite`,
              height: "100%",
              transformOrigin: "center center",
              width: "100%",
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "0",
              right: "0",
              margin: "auto",
              "& circle": {
                animation: `${l} 1.5s ease-in-out infinite`,
                strokeDasharray: "1,200",
                strokeDashoffset: 0,
                strokeLinecap: "round",
                stroke: "#FFF"
              }
            }
          };
        }
      };
      t.default = u;
    }