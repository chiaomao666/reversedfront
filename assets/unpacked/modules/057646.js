
      "use strict";

      t.__esModule = true;
      t.default = t.EXITING = t.ENTERED = t.ENTERING = t.EXITED = t.UNMOUNTED = undefined;
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
      }(n(52007));
      var a = s(n(72791));
      var r = s(n(54164));
      var i = n(23688);
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
      var c = "unmounted";
      t.UNMOUNTED = c;
      var l = "exited";
      t.EXITED = l;
      var u = "entering";
      t.ENTERING = u;
      var p = "entered";
      t.ENTERED = p;
      var d = "exiting";
      t.EXITING = d;
      var f = function (e) {
        var t;
        var n;
        function o(t, n) {
          var o;
          o = e.call(this, t, n) || this;
          var a;
          var r = n.transitionGroup;
          var i = (() => {
            if (r && !r.isMounting) {
              return t.enter;
            } else {
              return t.appear;
            }
          })();
          o.appearStatus = null;
          (() => {
            if (t.in) {
              return (() => {
                if (i) {
                  a = l;
                  return o.appearStatus = u;
                } else {
                  return a = p;
                }
              })();
            } else {
              return a = (() => {
                if (t.unmountOnExit || t.mountOnEnter) {
                  return c;
                } else {
                  return l;
                }
              })();
            }
          })();
          o.state = {
            status: a
          };
          o.nextCallback = null;
          return o;
        }
        n = e;
        (t = o).prototype = Object.create(n.prototype);
        t.prototype.constructor = t;
        t.__proto__ = n;
        var i = o.prototype;
        i.getChildContext = function () {
          return {
            transitionGroup: null
          };
        };
        o.getDerivedStateFromProps = function (e, t) {
          return (() => {
            if (e.in && t.status === c) {
              return {
                status: l
              };
            } else {
              return null;
            }
          })();
        };
        i.componentDidMount = function () {
          this.updateStatus(true, this.appearStatus);
        };
        i.componentDidUpdate = function (e) {
          var t = null;
          if (e !== this.props) {
            var n = this.state.status;
            (() => {
              if (this.props.in) {
                return n !== u && n !== p && (t = u);
              } else {
                return n !== u && n !== p || (t = d);
              }
            })();
          }
          this.updateStatus(false, t);
        };
        i.componentWillUnmount = function () {
          this.cancelNextCallback();
        };
        i.getTimeouts = function () {
          var e;
          var t;
          var n;
          var o = this.props.timeout;
          e = t = n = o;
          if (o != null && typeof o !== "number") {
            e = o.exit;
            t = o.enter;
            n = (() => {
              if (o.appear !== undefined) {
                return o.appear;
              } else {
                return t;
              }
            })();
          }
          return {
            exit: e,
            enter: t,
            appear: n
          };
        };
        i.updateStatus = function (e = false, t) {
          if (t !== null) {
            this.cancelNextCallback();
            var n = r.default.findDOMNode(this);
            (() => {
              if (t === u) {
                return this.performEnter(n, e);
              } else {
                return this.performExit(n);
              }
            })();
          } else if (this.props.unmountOnExit && this.state.status === l) {
            this.setState({
              status: c
            });
          }
        };
        i.performEnter = function (e, t) {
          var n = this;
          var o = this.props.enter;
          var a = (() => {
            if (this.context.transitionGroup) {
              return this.context.transitionGroup.isMounting;
            } else {
              return t;
            }
          })();
          var r = this.getTimeouts();
          var i = (() => {
            if (a) {
              return r.appear;
            } else {
              return r.enter;
            }
          })();
          (() => {
            if (t || o) {
              this.props.onEnter(e, a);
              return this.safeSetState({
                status: u
              }, function () {
                n.props.onEntering(e, a);
                n.onTransitionEnd(e, i, function () {
                  n.safeSetState({
                    status: p
                  }, function () {
                    n.props.onEntered(e, a);
                  });
                });
              });
            } else {
              return this.safeSetState({
                status: p
              }, function () {
                n.props.onEntered(e);
              });
            }
          })();
        };
        i.performExit = function (e) {
          var t = this;
          var n = this.props.exit;
          var o = this.getTimeouts();
          (() => {
            if (n) {
              this.props.onExit(e);
              return this.safeSetState({
                status: d
              }, function () {
                t.props.onExiting(e);
                t.onTransitionEnd(e, o.exit, function () {
                  t.safeSetState({
                    status: l
                  }, function () {
                    t.props.onExited(e);
                  });
                });
              });
            } else {
              return this.safeSetState({
                status: l
              }, function () {
                t.props.onExited(e);
              });
            }
          })();
        };
        i.cancelNextCallback = function () {
          if (this.nextCallback !== null) {
            this.nextCallback.cancel();
            this.nextCallback = null;
          }
        };
        i.safeSetState = function (e, t) {
          t = this.setNextCallback(t);
          this.setState(e, t);
        };
        i.setNextCallback = function (e) {
          var t = this;
          var n = true;
          this.nextCallback = function (o) {
            if (n) {
              n = false;
              t.nextCallback = null;
              e(o);
            }
          };
          this.nextCallback.cancel = function () {
            n = false;
          };
          return this.nextCallback;
        };
        i.onTransitionEnd = function (e, t, n) {
          this.setNextCallback(n);
          var o = t == null && !this.props.addEndListener;
          (() => {
            if (e && !o) {
              if (this.props.addEndListener) {
                this.props.addEndListener(e, this.nextCallback);
              }
              return t != null && setTimeout(this.nextCallback, t);
            } else {
              return setTimeout(this.nextCallback, 0);
            }
          })();
        };
        i.render = function () {
          var e = this.state.status;
          if (e === c) {
            return null;
          }
          var t = this.props;
          var n = t.children;
          var o = function (e, t) {
            if (e == null) {
              return {};
            }
            var n;
            var o;
            var a = {};
            var r = Object.keys(e);
            for (o = 0; o < r.length; o++) {
              n = r[o];
              if (!(t.indexOf(n) >= 0)) {
                a[n] = e[n];
              }
            }
            return a;
          }(t, ["children"]);
          delete o.in;
          delete o.mountOnEnter;
          delete o.unmountOnExit;
          delete o.appear;
          delete o.enter;
          delete o.exit;
          delete o.timeout;
          delete o.addEndListener;
          delete o.onEnter;
          delete o.onEntering;
          delete o.onEntered;
          delete o.onExit;
          delete o.onExiting;
          delete o.onExited;
          if (typeof n === "function") {
            return n(e, o);
          }
          var r = a.default.Children.only(n);
          return a.default.cloneElement(r, o);
        };
        return o;
      }(a.default.Component);
      function b() {}
      f.contextTypes = {
        transitionGroup: o.object
      };
      f.childContextTypes = {
        transitionGroup: function () {}
      };
      f.propTypes = {};
      f.defaultProps = {
        in: false,
        mountOnEnter: false,
        unmountOnExit: false,
        appear: false,
        enter: true,
        exit: true,
        onEnter: b,
        onEntering: b,
        onEntered: b,
        onExit: b,
        onExiting: b,
        onExited: b
      };
      f.UNMOUNTED = 0;
      f.EXITED = 1;
      f.ENTERING = 2;
      f.ENTERED = 3;
      f.EXITING = 4;
      var M = (0, i.polyfill)(f);
      t.default = M;
    }