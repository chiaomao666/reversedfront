
      "use strict";

      var o = n(44049);
      var a = Object.prototype.toString;
      function r(e) {
        return Array.isArray(e);
      }
      function i(e) {
        return typeof e === "undefined";
      }
      function s(e) {
        return a.call(e) === "[object ArrayBuffer]";
      }
      function c(e) {
        return e !== null && typeof e === "object";
      }
      function l(e) {
        if (a.call(e) !== "[object Object]") {
          return false;
        }
        var t = Object.getPrototypeOf(e);
        return t === null || t === Object.prototype;
      }
      function u(e) {
        return a.call(e) === "[object Function]";
      }
      function p(e, t) {
        if (e !== null && typeof e !== "undefined") {
          if (typeof e !== "object") {
            e = [e];
          }
          if (r(e)) {
            for (var n = 0, o = e.length; n < o; n++) {
              t.call(null, e[n], n, e);
            }
          } else {
            for (var a in e) {
              if (Object.prototype.hasOwnProperty.call(e, a)) {
                t.call(null, e[a], a, e);
              }
            }
          }
        }
      }
      e.exports = {
        isArray: r,
        isArrayBuffer: s,
        isBuffer: function (e) {
          return e !== null && !i(e) && e.constructor !== null && !i(e.constructor) && typeof e.constructor.isBuffer === "function" && e.constructor.isBuffer(e);
        },
        isFormData: function (e) {
          return a.call(e) === "[object FormData]";
        },
        isArrayBufferView: function (e) {
          return (() => {
            if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
              return ArrayBuffer.isView(e);
            } else {
              return e && e.buffer && s(e.buffer);
            }
          })();
        },
        isString: function (e) {
          return typeof e === "string";
        },
        isNumber: function (e) {
          return typeof e === "number";
        },
        isObject: c,
        isPlainObject: l,
        isUndefined: i,
        isDate: function (e) {
          return a.call(e) === "[object Date]";
        },
        isFile: function (e) {
          return a.call(e) === "[object File]";
        },
        isBlob: function (e) {
          return a.call(e) === "[object Blob]";
        },
        isFunction: u,
        isStream: function (e) {
          return c(e) && u(e.pipe);
        },
        isURLSearchParams: function (e) {
          return a.call(e) === "[object URLSearchParams]";
        },
        isStandardBrowserEnv: function () {
          return (typeof navigator === "undefined" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window !== "undefined" && typeof document !== "undefined";
        },
        forEach: p,
        merge: function e() {
          var t = {};
          function n(n, o) {
            (() => {
              if (l(t[o]) && l(n)) {
                return t[o] = e(t[o], n);
              } else {
                return (() => {
                  if (l(n)) {
                    return t[o] = e({}, n);
                  } else {
                    return (() => {
                      if (r(n)) {
                        return t[o] = n.slice();
                      } else {
                        return t[o] = n;
                      }
                    })();
                  }
                })();
              }
            })();
          }
          for (var o = 0, a = arguments.length; o < a; o++) {
            p(arguments[o], n);
          }
          return t;
        },
        extend: function (e, t, n) {
          p(t, function (t, a) {
            e[a] = (() => {
              if (n && typeof t === "function") {
                return o(t, n);
              } else {
                return t;
              }
            })();
          });
          return e;
        },
        trim: function (e) {
          return (() => {
            if (e.trim) {
              return e.trim();
            } else {
              return e.replace(/^\s+|\s+$/g, "");
            }
          })();
        },
        stripBOM: function (e) {
          if (e.charCodeAt(0) === 65279) {
            e = e.slice(1);
          }
          return e;
        }
      };
    }