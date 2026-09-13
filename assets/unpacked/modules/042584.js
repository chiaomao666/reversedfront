
      var o = typeof Map === "function" && Map.prototype;
      var a = (() => {
        if (Object.getOwnPropertyDescriptor && o) {
          return Object.getOwnPropertyDescriptor(Map.prototype, "size");
        } else {
          return null;
        }
      })();
      var r = (() => {
        if (o && a && typeof a.get === "function") {
          return a.get;
        } else {
          return null;
        }
      })();
      var i = o && Map.prototype.forEach;
      var s = typeof Set === "function" && Set.prototype;
      var c = (() => {
        if (Object.getOwnPropertyDescriptor && s) {
          return Object.getOwnPropertyDescriptor(Set.prototype, "size");
        } else {
          return null;
        }
      })();
      var l = (() => {
        if (s && c && typeof c.get === "function") {
          return c.get;
        } else {
          return null;
        }
      })();
      var u = s && Set.prototype.forEach;
      var p = (() => {
        if (typeof WeakMap === "function" && WeakMap.prototype) {
          return WeakMap.prototype.has;
        } else {
          return null;
        }
      })();
      var d = (() => {
        if (typeof WeakSet === "function" && WeakSet.prototype) {
          return WeakSet.prototype.has;
        } else {
          return null;
        }
      })();
      var f = (() => {
        if (typeof WeakRef === "function" && WeakRef.prototype) {
          return WeakRef.prototype.deref;
        } else {
          return null;
        }
      })();
      var b = Boolean.prototype.valueOf;
      var M = Object.prototype.toString;
      var A = Function.prototype.toString;
      var m = String.prototype.match;
      var h = String.prototype.slice;
      var z = String.prototype.replace;
      var O = String.prototype.toUpperCase;
      var g = String.prototype.toLowerCase;
      var v = RegExp.prototype.test;
      var y = Array.prototype.concat;
      var q = Array.prototype.join;
      var _ = Array.prototype.slice;
      var x = Math.floor;
      var W = (() => {
        if (typeof BigInt === "function") {
          return BigInt.prototype.valueOf;
        } else {
          return null;
        }
      })();
      var w = Object.getOwnPropertySymbols;
      var R = (() => {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          return Symbol.prototype.toString;
        } else {
          return null;
        }
      })();
      var k = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var L = (() => {
        if (typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === k || "symbol")) {
          return Symbol.toStringTag;
        } else {
          return null;
        }
      })();
      var S = Object.prototype.propertyIsEnumerable;
      var N = (() => {
        if (typeof Reflect === "function") {
          return Reflect.getPrototypeOf;
        } else {
          return Object.getPrototypeOf;
        }
      })() || (() => {
        if ([].__proto__ === Array.prototype) {
          return function (e) {
            return e.__proto__;
          };
        } else {
          return null;
        }
      })();
      function C(e, t) {
        if (e === Infinity || e === -Infinity || e !== e || e && e > -1000 && e < 1000 || v.call(/e/, t)) {
          return t;
        }
        var n = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof e === "number") {
          var o = (() => {
            if (e < 0) {
              return -x(-e);
            } else {
              return x(e);
            }
          })();
          if (o !== e) {
            var a = String(o);
            var r = h.call(t, a.length + 1);
            return z.call(a, n, "$&_") + "." + z.call(z.call(r, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return z.call(t, n, "$&_");
      }
      var E = n(24654);
      var B = E.custom;
      var T = (() => {
        if (F(B)) {
          return B;
        } else {
          return null;
        }
      })();
      var j = {
        __proto__: null,
        double: "\"",
        single: "'"
      };
      var I = {
        __proto__: null,
        double: /(["\\])/g,
        single: /(['\\])/g
      };
      function D(e, t, n) {
        var o = n.quoteStyle || t;
        var a = j[o];
        return a + e + a;
      }
      function P(e) {
        return z.call(String(e), /"/g, "&quot;");
      }
      function V(e) {
        return !L || typeof e !== "object" || !(L in e) && typeof e[L] === "undefined";
      }
      function X(e) {
        return Q(e) === "[object Array]" && V(e);
      }
      function Y(e) {
        return Q(e) === "[object RegExp]" && V(e);
      }
      function F(e) {
        if (k) {
          return e && typeof e === "object" && e instanceof Symbol;
        }
        if (typeof e === "symbol") {
          return true;
        }
        if (!e || typeof e !== "object" || !R) {
          return false;
        }
        try {
          R.call(e);
          return true;
        } catch (t) {}
        return false;
      }
      e.exports = function e(t, o, a, s) {
        var c = o || {};
        if (H(c, "quoteStyle") && !H(j, c.quoteStyle)) {
          throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
        }
        if (H(c, "maxStringLength") && (() => {
          if (typeof c.maxStringLength === "number") {
            return c.maxStringLength < 0 && c.maxStringLength !== Infinity;
          } else {
            return c.maxStringLength !== null;
          }
        })()) {
          throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
        }
        var M = !H(c, "customInspect") || c.customInspect;
        if (typeof M !== "boolean" && M !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (H(c, "indent") && c.indent !== null && c.indent !== "\t" && (parseInt(c.indent, 10) !== c.indent || !(c.indent > 0))) {
          throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
        }
        if (H(c, "numericSeparator") && typeof c.numericSeparator !== "boolean") {
          throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
        }
        var O = c.numericSeparator;
        if (typeof t === "undefined") {
          return "undefined";
        }
        if (t === null) {
          return "null";
        }
        if (typeof t === "boolean") {
          return (() => {
            if (t) {
              return "true";
            } else {
              return "false";
            }
          })();
        }
        if (typeof t === "string") {
          return J(t, c);
        }
        if (typeof t === "number") {
          if (t === 0) {
            return (() => {
              if (Infinity / t > 0) {
                return "0";
              } else {
                return "-0";
              }
            })();
          }
          var v = String(t);
          return (() => {
            if (O) {
              return C(t, v);
            } else {
              return v;
            }
          })();
        }
        if (typeof t === "bigint") {
          var x = String(t) + "n";
          return (() => {
            if (O) {
              return C(t, x);
            } else {
              return x;
            }
          })();
        }
        var w = (() => {
          if (typeof c.depth === "undefined") {
            return 5;
          } else {
            return c.depth;
          }
        })();
        if (typeof a === "undefined") {
          a = 0;
        }
        if (a >= w && w > 0 && typeof t === "object") {
          return (() => {
            if (X(t)) {
              return "[Array]";
            } else {
              return "[Object]";
            }
          })();
        }
        var B = function (e, t) {
          var n;
          if (e.indent === "\t") {
            n = "\t";
          } else {
            if (typeof e.indent !== "number" || !(e.indent > 0)) {
              return null;
            }
            n = q.call(Array(e.indent + 1), " ");
          }
          return {
            base: n,
            prev: q.call(Array(t + 1), n)
          };
        }(c, a);
        if (typeof s === "undefined") {
          s = [];
        } else if (K(s, t) >= 0) {
          return "[Circular]";
        }
        function I(t, n, o) {
          if (n) {
            (s = _.call(s)).push(n);
          }
          if (o) {
            var r = {
              depth: c.depth
            };
            if (H(c, "quoteStyle")) {
              r.quoteStyle = c.quoteStyle;
            }
            return e(t, r, a + 1, s);
          }
          return e(t, c, a + 1, s);
        }
        if (typeof t === "function" && !Y(t)) {
          var U = function (e) {
            if (e.name) {
              return e.name;
            }
            var t = m.call(A.call(e), /^function\s*([\w$]+)/);
            if (t) {
              return t[1];
            }
            return null;
          }(t);
          var G = ne(t, I);
          return "[Function" + (() => {
            if (U) {
              return ": " + U;
            } else {
              return " (anonymous)";
            }
          })() + "]" + (() => {
            if (G.length > 0) {
              return " { " + q.call(G, ", ") + " }";
            } else {
              return "";
            }
          })();
        }
        if (F(t)) {
          var oe = (() => {
            if (k) {
              return z.call(String(t), /^(Symbol\(.*\))_[^)]*$/, "$1");
            } else {
              return R.call(t);
            }
          })();
          return (() => {
            if (typeof t !== "object" || k) {
              return oe;
            } else {
              return Z(oe);
            }
          })();
        }
        if (function (e) {
          if (!e || typeof e !== "object") {
            return false;
          }
          if (typeof HTMLElement !== "undefined" && e instanceof HTMLElement) {
            return true;
          }
          return typeof e.nodeName === "string" && typeof e.getAttribute === "function";
        }(t)) {
          var ae = "<" + g.call(String(t.nodeName));
          for (var re = t.attributes || [], ie = 0; ie < re.length; ie++) {
            ae += " " + re[ie].name + "=" + D(P(re[ie].value), "double", c);
          }
          ae += ">";
          if (t.childNodes && t.childNodes.length) {
            ae += "...";
          }
          return ae += "</" + g.call(String(t.nodeName)) + ">";
        }
        if (X(t)) {
          if (t.length === 0) {
            return "[]";
          }
          var se = ne(t, I);
          return (() => {
            if (B && !function (e) {
              for (var t = 0; t < e.length; t++) {
                if (K(e[t], "\n") >= 0) {
                  return false;
                }
              }
              return true;
            }(se)) {
              return "[" + te(se, B) + "]";
            } else {
              return "[ " + q.call(se, ", ") + " ]";
            }
          })();
        }
        if (function (e) {
          return Q(e) === "[object Error]" && V(e);
        }(t)) {
          var ce = ne(t, I);
          return (() => {
            if ("cause" in Error.prototype || !("cause" in t) || S.call(t, "cause")) {
              return (() => {
                if (ce.length === 0) {
                  return "[" + String(t) + "]";
                } else {
                  return "{ [" + String(t) + "] " + q.call(ce, ", ") + " }";
                }
              })();
            } else {
              return "{ [" + String(t) + "] " + q.call(y.call("[cause]: " + I(t.cause), ce), ", ") + " }";
            }
          })();
        }
        if (typeof t === "object" && M) {
          if (T && typeof t[T] === "function" && E) {
            return E(t, {
              depth: w - a
            });
          }
          if (M !== "symbol" && typeof t.inspect === "function") {
            return t.inspect();
          }
        }
        if (function (e) {
          if (!r || !e || typeof e !== "object") {
            return false;
          }
          try {
            r.call(e);
            try {
              l.call(e);
            } catch (ae) {
              return true;
            }
            return e instanceof Map;
          } catch (t) {}
          return false;
        }(t)) {
          var le = [];
          if (i) {
            i.call(t, function (e, n) {
              le.push(I(n, t, true) + " => " + I(e, t));
            });
          }
          return ee("Map", r.call(t), le, B);
        }
        if (function (e) {
          if (!l || !e || typeof e !== "object") {
            return false;
          }
          try {
            l.call(e);
            try {
              r.call(e);
            } catch (t) {
              return true;
            }
            return e instanceof Set;
          } catch (n) {}
          return false;
        }(t)) {
          var ue = [];
          if (u) {
            u.call(t, function (e) {
              ue.push(I(e, t));
            });
          }
          return ee("Set", l.call(t), ue, B);
        }
        if (function (e) {
          if (!p || !e || typeof e !== "object") {
            return false;
          }
          try {
            p.call(e, p);
            try {
              d.call(e, d);
            } catch (ae) {
              return true;
            }
            return e instanceof WeakMap;
          } catch (t) {}
          return false;
        }(t)) {
          return $("WeakMap");
        }
        if (function (e) {
          if (!d || !e || typeof e !== "object") {
            return false;
          }
          try {
            d.call(e, d);
            try {
              p.call(e, p);
            } catch (ae) {
              return true;
            }
            return e instanceof WeakSet;
          } catch (t) {}
          return false;
        }(t)) {
          return $("WeakSet");
        }
        if (function (e) {
          if (!f || !e || typeof e !== "object") {
            return false;
          }
          try {
            f.call(e);
            return true;
          } catch (t) {}
          return false;
        }(t)) {
          return $("WeakRef");
        }
        if (function (e) {
          return Q(e) === "[object Number]" && V(e);
        }(t)) {
          return Z(I(Number(t)));
        }
        if (function (e) {
          if (!e || typeof e !== "object" || !W) {
            return false;
          }
          try {
            W.call(e);
            return true;
          } catch (t) {}
          return false;
        }(t)) {
          return Z(I(W.call(t)));
        }
        if (function (e) {
          return Q(e) === "[object Boolean]" && V(e);
        }(t)) {
          return Z(b.call(t));
        }
        if (function (e) {
          return Q(e) === "[object String]" && V(e);
        }(t)) {
          return Z(I(String(t)));
        }
        if (typeof window !== "undefined" && t === window) {
          return "{ [object Window] }";
        }
        if (typeof globalThis !== "undefined" && t === globalThis || typeof n.g !== "undefined" && t === n.g) {
          return "{ [object globalThis] }";
        }
        if (!function (e) {
          return Q(e) === "[object Date]" && V(e);
        }(t) && !Y(t)) {
          var pe = ne(t, I);
          var de = (() => {
            if (N) {
              return N(t) === Object.prototype;
            } else {
              return t instanceof Object || t.constructor === Object;
            }
          })();
          var fe = (() => {
            if (t instanceof Object) {
              return "";
            } else {
              return "null prototype";
            }
          })();
          var be = (() => {
            if (!de && L && Object(t) === t && L in t) {
              return h.call(Q(t), 8, -1);
            } else {
              return (() => {
                if (fe) {
                  return "Object";
                } else {
                  return "";
                }
              })();
            }
          })();
          var Me = (() => {
            if (de || typeof t.constructor !== "function") {
              return "";
            } else {
              return (() => {
                if (t.constructor.name) {
                  return t.constructor.name + " ";
                } else {
                  return "";
                }
              })();
            }
          })() + (() => {
            if (be || fe) {
              return "[" + q.call(y.call([], be || [], fe || []), ": ") + "] ";
            } else {
              return "";
            }
          })();
          return (() => {
            if (pe.length === 0) {
              return Me + "{}";
            } else {
              return (() => {
                if (B) {
                  return Me + "{" + te(pe, B) + "}";
                } else {
                  return Me + "{ " + q.call(pe, ", ") + " }";
                }
              })();
            }
          })();
        }
        return String(t);
      };
      var U = Object.prototype.hasOwnProperty || function (e) {
        return e in this;
      };
      function H(e, t) {
        return U.call(e, t);
      }
      function Q(e) {
        return M.call(e);
      }
      function K(e, t) {
        if (e.indexOf) {
          return e.indexOf(t);
        }
        for (var n = 0, o = e.length; n < o; n++) {
          if (e[n] === t) {
            return n;
          }
        }
        return -1;
      }
      function J(e, t) {
        if (e.length > t.maxStringLength) {
          var n = e.length - t.maxStringLength;
          var o = "... " + n + " more character" + (() => {
            if (n > 1) {
              return "s";
            } else {
              return "";
            }
          })();
          return J(h.call(e, 0, t.maxStringLength), t) + o;
        }
        var a = I[t.quoteStyle || "single"];
        a.lastIndex = 0;
        return D(z.call(z.call(e, a, "\\$1"), /[\x00-\x1f]/g, G), "single", t);
      }
      function G(e) {
        var t = e.charCodeAt(0);
        var n = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[t];
        return (() => {
          if (n) {
            return "\\" + n;
          } else {
            return "\\x" + (() => {
              if (t < 16) {
                return "0";
              } else {
                return "";
              }
            })() + O.call(t.toString(16));
          }
        })();
      }
      function Z(e) {
        return "Object(" + e + ")";
      }
      function $(e) {
        return e + " { ? }";
      }
      function ee(e, t, n, o) {
        return e + " (" + t + ") {" + (() => {
          if (o) {
            return te(n, o);
          } else {
            return q.call(n, ", ");
          }
        })() + "}";
      }
      function te(e, t) {
        if (e.length === 0) {
          return "";
        }
        var n = "\n" + t.prev + t.base;
        return n + q.call(e, "," + n) + "\n" + t.prev;
      }
      function ne(e, t) {
        var n = X(e);
        var o = [];
        if (n) {
          o.length = e.length;
          for (var a = 0; a < e.length; a++) {
            o[a] = (() => {
              if (H(e, a)) {
                return t(e[a], e);
              } else {
                return "";
              }
            })();
          }
        }
        var r;
        var i = (() => {
          if (typeof w === "function") {
            return w(e);
          } else {
            return [];
          }
        })();
        if (k) {
          r = {};
          for (var s = 0; s < i.length; s++) {
            r["$" + i[s]] = i[s];
          }
        }
        for (var c in e) {
          if (H(e, c)) {
            if ((!n || String(Number(c)) !== c || !(c < e.length)) && (!k || !(r["$" + c] instanceof Symbol))) {
              (() => {
                if (v.call(/[^\w$]/, c)) {
                  return o.push(t(c, e) + ": " + t(e[c], e));
                } else {
                  return o.push(c + ": " + t(e[c], e));
                }
              })();
            }
          }
        }
        if (typeof w === "function") {
          for (var l = 0; l < i.length; l++) {
            if (S.call(e, i[l])) {
              o.push("[" + t(i[l]) + "]: " + t(e[i[l]], e));
            }
          }
        }
        return o;
      }
    }