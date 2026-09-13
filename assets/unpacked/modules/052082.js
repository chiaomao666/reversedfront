
      "use strict";

      t.__esModule = true;
      t.default = undefined;
      (function (e) {
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
      })(n(52007));
      var o = s(n(54516));
      var a = s(n(99981));
      var r = s(n(72791));
      var i = s(n(57646));
      n(58979);
      function s(e) {
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
      function c() {
        c = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) {
              if (Object.prototype.hasOwnProperty.call(n, o)) {
                e[o] = n[o];
              }
            }
          }
          return e;
        };
        return c.apply(this, arguments);
      }
      function l(e, t) {
        return e && t && t.split(" ").forEach(function (t) {
          return (0, o.default)(e, t);
        });
      }
      function u(e, t) {
        return e && t && t.split(" ").forEach(function (t) {
          return (0, a.default)(e, t);
        });
      }
      var p = function (e) {
        var t;
        var n;
        function o() {
          var t;
          for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) {
            o[a] = arguments[a];
          }
          (t = e.call.apply(e, [this].concat(o)) || this).onEnter = function (e, n) {
            var o = t.getClassNames((() => {
              if (n) {
                return "appear";
              } else {
                return "enter";
              }
            })()).className;
            t.removeClasses(e, "exit");
            l(e, o);
            if (t.props.onEnter) {
              t.props.onEnter(e, n);
            }
          };
          t.onEntering = function (e, n) {
            var o = t.getClassNames((() => {
              if (n) {
                return "appear";
              } else {
                return "enter";
              }
            })()).activeClassName;
            t.reflowAndAddClass(e, o);
            if (t.props.onEntering) {
              t.props.onEntering(e, n);
            }
          };
          t.onEntered = function (e, n) {
            var o = t.getClassNames("appear").doneClassName;
            var a = t.getClassNames("enter").doneClassName;
            var r = (() => {
              if (n) {
                return o + " " + a;
              } else {
                return a;
              }
            })();
            t.removeClasses(e, (() => {
              if (n) {
                return "appear";
              } else {
                return "enter";
              }
            })());
            l(e, r);
            if (t.props.onEntered) {
              t.props.onEntered(e, n);
            }
          };
          t.onExit = function (e) {
            var n = t.getClassNames("exit").className;
            t.removeClasses(e, "appear");
            t.removeClasses(e, "enter");
            l(e, n);
            if (t.props.onExit) {
              t.props.onExit(e);
            }
          };
          t.onExiting = function (e) {
            var n = t.getClassNames("exit").activeClassName;
            t.reflowAndAddClass(e, n);
            if (t.props.onExiting) {
              t.props.onExiting(e);
            }
          };
          t.onExited = function (e) {
            var n = t.getClassNames("exit").doneClassName;
            t.removeClasses(e, "exit");
            l(e, n);
            if (t.props.onExited) {
              t.props.onExited(e);
            }
          };
          t.getClassNames = function (e) {
            var n = t.props.classNames;
            var o = typeof n === "string";
            var a = (() => {
              if (o) {
                return (() => {
                  if (o && n) {
                    return n + "-";
                  } else {
                    return "";
                  }
                })() + e;
              } else {
                return n[e];
              }
            })();
            return {
              className: a,
              activeClassName: (() => {
                if (o) {
                  return a + "-active";
                } else {
                  return n[e + "Active"];
                }
              })(),
              doneClassName: (() => {
                if (o) {
                  return a + "-done";
                } else {
                  return n[e + "Done"];
                }
              })()
            };
          };
          return t;
        }
        n = e;
        (t = o).prototype = Object.create(n.prototype);
        t.prototype.constructor = t;
        t.__proto__ = n;
        var a = o.prototype;
        a.removeClasses = function (e, t) {
          var n = this.getClassNames(t);
          var o = n.className;
          var a = n.activeClassName;
          var r = n.doneClassName;
          if (o) {
            u(e, o);
          }
          if (a) {
            u(e, a);
          }
          if (r) {
            u(e, r);
          }
        };
        a.reflowAndAddClass = function (e, t) {
          if (t) {
            if (e) {
              e.scrollTop;
            }
            l(e, t);
          }
        };
        a.render = function () {
          var e = c({}, this.props);
          delete e.classNames;
          return r.default.createElement(i.default, c({}, e, {
            onEnter: this.onEnter,
            onEntered: this.onEntered,
            onEntering: this.onEntering,
            onExit: this.onExit,
            onExiting: this.onExiting,
            onExited: this.onExited
          }));
        };
        return o;
      }(r.default.Component);
      p.defaultProps = {
        classNames: ""
      };
      p.propTypes = {};
      var d = p;
      t.default = d;
      e.exports = t.default;
    }