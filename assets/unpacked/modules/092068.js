
      "use strict";

      e.exports = function () {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var e = {};
        var t = Symbol("test");
        var n = Object(t);
        if (typeof t === "string") {
          return false;
        }
        if (Object.prototype.toString.call(t) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(n) !== "[object Symbol]") {
          return false;
        }
        e[t] = 42;
        for (var o in e) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(e).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(e).length !== 0) {
          return false;
        }
        var a = Object.getOwnPropertySymbols(e);
        if (a.length !== 1 || a[0] !== t) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(e, t)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var r = Object.getOwnPropertyDescriptor(e, t);
          if (r.value !== 42 || r.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }