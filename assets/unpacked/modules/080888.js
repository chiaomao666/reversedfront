
      "use strict";

      var o = n(79047);
      function a() {}
      function r() {}
      r.resetWarningCache = a;
      e.exports = function () {
        function e(e, t, n, a, r, i) {
          if (i !== o) {
            var s = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
            s.name = "Invariant Violation";
            throw s;
          }
        }
        function t() {
          return e;
        }
        e.isRequired = e;
        var n = {
          array: e,
          bigint: e,
          bool: e,
          func: e,
          number: e,
          object: e,
          string: e,
          symbol: e,
          any: e,
          arrayOf: t,
          element: e,
          elementType: e,
          instanceOf: t,
          node: e,
          objectOf: t,
          oneOf: t,
          oneOfType: t,
          shape: t,
          exact: t,
          checkPropTypes: r,
          resetWarningCache: a
        };
        n.PropTypes = n;
        return n;
      };
    }