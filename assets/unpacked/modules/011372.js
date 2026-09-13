
      "use strict";

      var n = typeof Symbol === "function" && Symbol.for;
      var o = (() => {
        if (n) {
          return Symbol.for("react.element");
        } else {
          return 60103;
        }
      })();
      var a = (() => {
        if (n) {
          return Symbol.for("react.portal");
        } else {
          return 60106;
        }
      })();
      var r = (() => {
        if (n) {
          return Symbol.for("react.fragment");
        } else {
          return 60107;
        }
      })();
      var i = (() => {
        if (n) {
          return Symbol.for("react.strict_mode");
        } else {
          return 60108;
        }
      })();
      var s = (() => {
        if (n) {
          return Symbol.for("react.profiler");
        } else {
          return 60114;
        }
      })();
      var c = (() => {
        if (n) {
          return Symbol.for("react.provider");
        } else {
          return 60109;
        }
      })();
      var l = (() => {
        if (n) {
          return Symbol.for("react.context");
        } else {
          return 60110;
        }
      })();
      var u = (() => {
        if (n) {
          return Symbol.for("react.async_mode");
        } else {
          return 60111;
        }
      })();
      var p = (() => {
        if (n) {
          return Symbol.for("react.concurrent_mode");
        } else {
          return 60111;
        }
      })();
      var d = (() => {
        if (n) {
          return Symbol.for("react.forward_ref");
        } else {
          return 60112;
        }
      })();
      var f = (() => {
        if (n) {
          return Symbol.for("react.suspense");
        } else {
          return 60113;
        }
      })();
      var b = (() => {
        if (n) {
          return Symbol.for("react.suspense_list");
        } else {
          return 60120;
        }
      })();
      var M = (() => {
        if (n) {
          return Symbol.for("react.memo");
        } else {
          return 60115;
        }
      })();
      var A = (() => {
        if (n) {
          return Symbol.for("react.lazy");
        } else {
          return 60116;
        }
      })();
      var m = (() => {
        if (n) {
          return Symbol.for("react.block");
        } else {
          return 60121;
        }
      })();
      var h = (() => {
        if (n) {
          return Symbol.for("react.fundamental");
        } else {
          return 60117;
        }
      })();
      var z = (() => {
        if (n) {
          return Symbol.for("react.responder");
        } else {
          return 60118;
        }
      })();
      var O = (() => {
        if (n) {
          return Symbol.for("react.scope");
        } else {
          return 60119;
        }
      })();
      function g(e) {
        if (typeof e === "object" && e !== null) {
          var t = e.$$typeof;
          switch (t) {
            case o:
              switch (e = e.type) {
                case u:
                case p:
                case r:
                case s:
                case i:
                case f:
                  return e;
                default:
                  switch (e = e && e.$$typeof) {
                    case l:
                    case d:
                    case A:
                    case M:
                    case c:
                      return e;
                    default:
                      return t;
                  }
              }
            case a:
              return t;
          }
        }
      }
      function v(e) {
        return g(e) === p;
      }
      t.isFragment = function (e) {
        return g(e) === r;
      };
      t.isMemo = function (e) {
        return g(e) === M;
      };
    }