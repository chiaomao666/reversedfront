
      "use strict";

      var o = function (e) {
        if (e && e.__esModule) {
          return e;
        }
        var t = {};
        if (e != null) {
          for (var n in e) {
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              var o = (() => {
                if (Object.defineProperty && Object.getOwnPropertyDescriptor) {
                  return Object.getOwnPropertyDescriptor(e, n);
                } else {
                  return {};
                }
              })();
              (() => {
                if (o.get || o.set) {
                  return Object.defineProperty(t, n, o);
                } else {
                  return t[n] = e[n];
                }
              })();
            }
          }
        }
        t.default = e;
        return t;
      }(n(72791));
      var a = l(n(52007));
      var r = n(6040);
      var i = n(23363);
      var s = l(n(2741));
      var c = l(n(79818));
      function l(e) {
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
      function u(e) {
        u = (() => {
          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            return function (e) {
              return typeof e;
            };
          } else {
            return function (e) {
              return (() => {
                if (e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype) {
                  return "symbol";
                } else {
                  return typeof e;
                }
              })();
            };
          }
        })();
        return u(e);
      }
      function p(e) {
        return function (e) {
          if (Array.isArray(e)) {
            for (var t = 0, n = new Array(e.length); t < e.length; t++) {
              n[t] = e[t];
            }
            return n;
          }
        }(e) || function (e) {
          if (Symbol.iterator in Object(e) || Object.prototype.toString.call(e) === "[object Arguments]") {
            return Array.from(e);
          }
        }(e) || function () {
          throw new TypeError("Invalid attempt to spread non-iterable instance");
        }();
      }
      function d(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || false;
          o.configurable = true;
          if ("value" in o) {
            o.writable = true;
          }
          Object.defineProperty(e, o.key, o);
        }
      }
      function f(e) {
        f = (() => {
          if (Object.setPrototypeOf) {
            return Object.getPrototypeOf;
          } else {
            return function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            };
          }
        })();
        return f(e);
      }
      function b(e, t) {
        b = Object.setPrototypeOf || function (e, t) {
          e.__proto__ = t;
          return e;
        };
        return b(e, t);
      }
      function M(e) {
        if (e === undefined) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
      }
      function A(e, t, n) {
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
      var m = function (e) {
        function t(e) {
          var n;
          (function (e, t) {
            if (!(e instanceof t)) {
              throw new TypeError("Cannot call a class as a function");
            }
          })(this, t);
          n = function (e, t) {
            return (() => {
              if (!t || u(t) !== "object" && typeof t !== "function") {
                return M(e);
              } else {
                return t;
              }
            })();
          }(this, f(t).call(this, e));
          A(M(M(n)), "getStyles", function (e, t) {
            var o = c.default[e](t, n.props);
            var a = n.props.styles[e];
            return (() => {
              if (a) {
                return (() => {
                  if (typeof a === "function") {
                    return a(o, n.props);
                  } else {
                    return a;
                  }
                })();
              } else {
                return o;
              }
            })();
          });
          A(M(M(n)), "cx", function (e) {
            var t = (() => {
              if (Array.isArray(e)) {
                return e;
              } else {
                return [e];
              }
            })();
            for (var o = arguments.length, a = new Array((() => {
                if (o > 1) {
                  return o - 1;
                } else {
                  return 0;
                }
              })()), r = 1; r < o; r++) {
              a[r - 1] = arguments[r];
            }
            return i.cx.apply(undefined, p(t.map(function (e) {
              return (() => {
                if (e) {
                  return `${n.props.classNamePrefix}${e}`;
                } else {
                  return "";
                }
              })();
            })).concat(a));
          });
          n.wrapper = o.default.createRef();
          n.state = {
            overflowCSS: {}
          };
          return n;
        }
        var n;
        var a;
        var l;
        (function (e, t) {
          if (typeof t !== "function" && t !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: true,
              configurable: true
            }
          });
          if (t) {
            b(e, t);
          }
        })(t, e);
        n = t;
        if (a = [{
          key: "componentDidMount",
          value: function () {
            var e = window.getComputedStyle(this.wrapper.current);
            var t = ["overflow", "overflowX", "overflowY"].reduce(function (t, n) {
              if (e[n] !== "visible") {
                t[n] = "hidden";
              }
              return t;
            }, {});
            this.setState({
              overflowCSS: t
            });
          }
        }, {
          key: "componentDidUpdate",
          value: function (e) {
            if (this.props.active) {
              this.wrapper.current.scrollTop = 0;
            }
          }
        }, {
          key: "render",
          value: function () {
            var e = this;
            var t = this.state.overflowCSS;
            var n = this.props;
            var a = n.children;
            var c = n.className;
            var l = n.onClick;
            var u = n.active;
            var p = n.fadeSpeed;
            var d = n.spinner;
            var f = n.text;
            return o.default.createElement("div", {
              "data-testid": "wrapper",
              ref: this.wrapper,
              className: this.cx(["wrapper", u && "wrapper--active"], (0, i.css)(this.getStyles("wrapper", (() => {
                if (u) {
                  return t;
                } else {
                  return {};
                }
              })())), c)
            }, o.default.createElement(r.CSSTransition, {
              in: u,
              classNames: "_loading-overlay-transition",
              timeout: p,
              unmountOnExit: true
            }, function (t) {
              return o.default.createElement("div", {
                "data-testid": "overlay",
                className: e.cx("overlay", (0, i.css)(e.getStyles("overlay", t))),
                onClick: l
              }, o.default.createElement("div", {
                className: e.cx("content", (0, i.css)(e.getStyles("content")))
              }, d && (() => {
                if (typeof d === "boolean") {
                  return o.default.createElement(s.default, {
                    cx: e.cx,
                    getStyles: e.getStyles
                  });
                } else {
                  return d;
                }
              })(), f));
            }), a);
          }
        }]) {
          d(n.prototype, a);
        }
        if (l) {
          d(n, l);
        }
        return t;
      }(o.Component);
      m.propTypes = {
        active: a.default.bool,
        fadeSpeed: a.default.number,
        onClick: a.default.func,
        className: a.default.string,
        classNamePrefix: a.default.string,
        spinner: a.default.oneOfType([a.default.bool, a.default.node]),
        text: a.default.node,
        styles: a.default.shape({
          content: a.default.function,
          overlay: a.default.function,
          spinner: a.default.function,
          wrapper: a.default.function
        })
      };
      m.defaultProps = {
        classNamePrefix: "_loading_overlay_",
        fadeSpeed: 500,
        styles: {}
      };
    }