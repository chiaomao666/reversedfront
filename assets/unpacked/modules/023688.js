
      "use strict";

      function o() {
        var e = this.constructor.getDerivedStateFromProps(this.props, this.state);
        if (e !== null && e !== undefined) {
          this.setState(e);
        }
      }
      function a(e) {
        this.setState(function (t) {
          var n = this.constructor.getDerivedStateFromProps(e, t);
          return (() => {
            if (n !== null && n !== undefined) {
              return n;
            } else {
              return null;
            }
          })();
        }.bind(this));
      }
      function r(e, t) {
        try {
          var n = this.props;
          var o = this.state;
          this.props = e;
          this.state = t;
          this.__reactInternalSnapshotFlag = true;
          this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(n, o);
        } finally {
          this.props = n;
          this.state = o;
        }
      }
      function i(e) {
        var t = e.prototype;
        if (!t || !t.isReactComponent) {
          throw new Error("Can only polyfill class components");
        }
        if (typeof e.getDerivedStateFromProps !== "function" && typeof t.getSnapshotBeforeUpdate !== "function") {
          return e;
        }
        var n = null;
        var i = null;
        var s = null;
        (() => {
          if (typeof t.componentWillMount === "function") {
            return n = "componentWillMount";
          } else {
            return typeof t.UNSAFE_componentWillMount === "function" && (n = "UNSAFE_componentWillMount");
          }
        })();
        (() => {
          if (typeof t.componentWillReceiveProps === "function") {
            return i = "componentWillReceiveProps";
          } else {
            return typeof t.UNSAFE_componentWillReceiveProps === "function" && (i = "UNSAFE_componentWillReceiveProps");
          }
        })();
        (() => {
          if (typeof t.componentWillUpdate === "function") {
            return s = "componentWillUpdate";
          } else {
            return typeof t.UNSAFE_componentWillUpdate === "function" && (s = "UNSAFE_componentWillUpdate");
          }
        })();
        if (n !== null || i !== null || s !== null) {
          var c = e.displayName || e.name;
          var l = (() => {
            if (typeof e.getDerivedStateFromProps === "function") {
              return "getDerivedStateFromProps()";
            } else {
              return "getSnapshotBeforeUpdate()";
            }
          })();
          throw Error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n" + c + " uses " + l + " but also contains the following legacy lifecycles:" + (() => {
            if (n !== null) {
              return "\n  " + n;
            } else {
              return "";
            }
          })() + (() => {
            if (i !== null) {
              return "\n  " + i;
            } else {
              return "";
            }
          })() + (() => {
            if (s !== null) {
              return "\n  " + s;
            } else {
              return "";
            }
          })() + "\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks");
        }
        if (typeof e.getDerivedStateFromProps === "function") {
          t.componentWillMount = o;
          t.componentWillReceiveProps = a;
        }
        if (typeof t.getSnapshotBeforeUpdate === "function") {
          if (typeof t.componentDidUpdate !== "function") {
            throw new Error("Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype");
          }
          t.componentWillUpdate = r;
          var u = t.componentDidUpdate;
          t.componentDidUpdate = function (e, t, n) {
            var o = (() => {
              if (this.__reactInternalSnapshotFlag) {
                return this.__reactInternalSnapshot;
              } else {
                return n;
              }
            })();
            u.call(this, e, t, o);
          };
        }
        return e;
      }
      n.r(t);
      n.d(t, {
        polyfill: function () {
          return i;
        }
      });
      o.__suppressDeprecationWarning = true;
      a.__suppressDeprecationWarning = true;
      r.__suppressDeprecationWarning = true;
    }