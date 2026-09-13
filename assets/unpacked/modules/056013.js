
      "use strict";

      t.__esModule = true;
      t.default = undefined;
      var o = s(n(52007));
      var a = s(n(72791));
      var r = n(23688);
      var i = n(5176);
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
      function l(e) {
        if (e === undefined) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
      }
      var u = Object.values || function (e) {
        return Object.keys(e).map(function (t) {
          return e[t];
        });
      };
      var p = function (e) {
        var t;
        var n;
        function o(t, n) {
          var o;
          var a = (o = e.call(this, t, n) || this).handleExited.bind(l(l(o)));
          o.state = {
            handleExited: a,
            firstRender: true
          };
          return o;
        }
        n = e;
        (t = o).prototype = Object.create(n.prototype);
        t.prototype.constructor = t;
        t.__proto__ = n;
        var r = o.prototype;
        r.getChildContext = function () {
          return {
            transitionGroup: {
              isMounting: !this.appeared
            }
          };
        };
        r.componentDidMount = function () {
          this.appeared = true;
          this.mounted = true;
        };
        r.componentWillUnmount = function () {
          this.mounted = false;
        };
        o.getDerivedStateFromProps = function (e, t) {
          var n = t.children;
          var o = t.handleExited;
          return {
            children: (() => {
              if (t.firstRender) {
                return (0, i.getInitialChildMapping)(e, o);
              } else {
                return (0, i.getNextChildMapping)(e, n, o);
              }
            })(),
            firstRender: false
          };
        };
        r.handleExited = function (e, t) {
          var n = (0, i.getChildMapping)(this.props.children);
          if (!(e.key in n)) {
            if (e.props.onExited) {
              e.props.onExited(t);
            }
            if (this.mounted) {
              this.setState(function (t) {
                var n = c({}, t.children);
                delete n[e.key];
                return {
                  children: n
                };
              });
            }
          }
        };
        r.render = function () {
          var e = this.props;
          var t = e.component;
          var n = e.childFactory;
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
          }(e, ["component", "childFactory"]);
          var r = u(this.state.children).map(n);
          delete o.appear;
          delete o.enter;
          delete o.exit;
          return (() => {
            if (t === null) {
              return r;
            } else {
              return a.default.createElement(t, o, r);
            }
          })();
        };
        return o;
      }(a.default.Component);
      p.childContextTypes = {
        transitionGroup: o.default.object.isRequired
      };
      p.propTypes = {};
      p.defaultProps = {
        component: "div",
        childFactory: function (e) {
          return e;
        }
      };
      var d = (0, r.polyfill)(p);
      t.default = d;
      e.exports = t.default;
    }