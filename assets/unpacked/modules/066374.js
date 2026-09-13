
      "use strict";

      var o = n(72791);
      var a = Symbol.for("react.element");
      var r = Symbol.for("react.fragment");
      var i = Object.prototype.hasOwnProperty;
      var s = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
      var c = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      function l(e, t, n) {
        var o;
        var r = {};
        var l = null;
        var u = null;
        if (n !== undefined) {
          l = "" + n;
        }
        if (t.key !== undefined) {
          l = "" + t.key;
        }
        if (t.ref !== undefined) {
          u = t.ref;
        }
        for (o in t) {
          if (i.call(t, o) && !c.hasOwnProperty(o)) {
            r[o] = t[o];
          }
        }
        if (e && e.defaultProps) {
          for (o in t = e.defaultProps) {
            if (r[o] === undefined) {
              r[o] = t[o];
            }
          }
        }
        return {
          $$typeof: a,
          type: e,
          key: l,
          ref: u,
          props: r,
          _owner: s.current
        };
      }
      t.Fragment = r;
      t.jsx = l;
      t.jsxs = l;
    }