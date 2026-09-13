
      "use strict";

      t.__esModule = true;
      t.default = undefined;
      i(n(52007));
      var o = i(n(72791));
      var a = n(54164);
      var r = i(n(56013));
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
      var s = function (e) {
        var t;
        var n;
        function i() {
          var t;
          for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) {
            o[a] = arguments[a];
          }
          (t = e.call.apply(e, [this].concat(o)) || this).handleEnter = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onEnter", 0, n);
          };
          t.handleEntering = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onEntering", 0, n);
          };
          t.handleEntered = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onEntered", 0, n);
          };
          t.handleExit = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onExit", 1, n);
          };
          t.handleExiting = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onExiting", 1, n);
          };
          t.handleExited = function () {
            for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++) {
              n[o] = arguments[o];
            }
            return t.handleLifecycle("onExited", 1, n);
          };
          return t;
        }
        n = e;
        (t = i).prototype = Object.create(n.prototype);
        t.prototype.constructor = t;
        t.__proto__ = n;
        var s = i.prototype;
        s.handleLifecycle = function (e, t, n) {
          var r;
          var i = this.props.children;
          var s = o.default.Children.toArray(i)[t];
          if (s.props[e]) {
            (r = s.props)[e].apply(r, n);
          }
          if (this.props[e]) {
            this.props[e]((0, a.findDOMNode)(this));
          }
        };
        s.render = function () {
          var e = this.props;
          var t = e.children;
          var n = e.in;
          var a = function (e, t) {
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
          }(e, ["children", "in"]);
          var i = o.default.Children.toArray(t);
          var s = i[0];
          var c = i[1];
          delete a.onEnter;
          delete a.onEntering;
          delete a.onEntered;
          delete a.onExit;
          delete a.onExiting;
          delete a.onExited;
          return o.default.createElement(r.default, a, (() => {
            if (n) {
              return o.default.cloneElement(s, {
                key: "first",
                onEnter: this.handleEnter,
                onEntering: this.handleEntering,
                onEntered: this.handleEntered
              });
            } else {
              return o.default.cloneElement(c, {
                key: "second",
                onEnter: this.handleExit,
                onEntering: this.handleExiting,
                onEntered: this.handleExited
              });
            }
          })());
        };
        return i;
      }(o.default.Component);
      s.propTypes = {};
      var c = s;
      t.default = c;
      e.exports = t.default;
    }