
      "use strict";

      var o;
      var a = n(39647);
      var r = n(47113);
      var i = n(68678);
      var s = n(59481);
      var c = n(72347);
      var l = n(99082);
      var u = n(87822);
      var p = n(89365);
      var d = n(50536);
      var f = n(43968);
      var b = n(67869);
      var M = n(91450);
      var A = n(62172);
      var m = n(26575);
      var h = n(11264);
      var z = Function;
      function O(e) {
        try {
          return z("\"use strict\"; return (" + e + ").constructor;")();
        } catch (t) {}
      }
      var g = n(23347);
      var v = n(20442);
      function y() {
        throw new u();
      }
      var q = (() => {
        if (g) {
          return function () {
            try {
              return y;
            } catch (e) {
              try {
                return g(arguments, "callee").get;
              } catch (t) {
                return y;
              }
            }
          }();
        } else {
          return y;
        }
      })();
      var _ = n(28630)();
      var x = n(42947);
      var W = n(81202);
      var w = n(28533);
      var R = n(84265);
      var k = n(31208);
      var L = {};
      var S = (() => {
        if (typeof Uint8Array !== "undefined" && x) {
          return x(Uint8Array);
        } else {
          return o;
        }
      })();
      var N = {
        __proto__: null,
        "%AggregateError%": (() => {
          if (typeof AggregateError === "undefined") {
            return o;
          } else {
            return AggregateError;
          }
        })(),
        "%Array%": Array,
        "%ArrayBuffer%": (() => {
          if (typeof ArrayBuffer === "undefined") {
            return o;
          } else {
            return ArrayBuffer;
          }
        })(),
        "%ArrayIteratorPrototype%": (() => {
          if (_ && x) {
            return x([][Symbol.iterator]());
          } else {
            return o;
          }
        })(),
        "%AsyncFromSyncIteratorPrototype%": o,
        "%AsyncFunction%": L,
        "%AsyncGenerator%": L,
        "%AsyncGeneratorFunction%": L,
        "%AsyncIteratorPrototype%": L,
        "%Atomics%": (() => {
          if (typeof Atomics === "undefined") {
            return o;
          } else {
            return Atomics;
          }
        })(),
        "%BigInt%": (() => {
          if (typeof BigInt === "undefined") {
            return o;
          } else {
            return BigInt;
          }
        })(),
        "%BigInt64Array%": (() => {
          if (typeof BigInt64Array === "undefined") {
            return o;
          } else {
            return BigInt64Array;
          }
        })(),
        "%BigUint64Array%": (() => {
          if (typeof BigUint64Array === "undefined") {
            return o;
          } else {
            return BigUint64Array;
          }
        })(),
        "%Boolean%": Boolean,
        "%DataView%": (() => {
          if (typeof DataView === "undefined") {
            return o;
          } else {
            return DataView;
          }
        })(),
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": r,
        "%eval%": eval,
        "%EvalError%": i,
        "%Float16Array%": (() => {
          if (typeof Float16Array === "undefined") {
            return o;
          } else {
            return Float16Array;
          }
        })(),
        "%Float32Array%": (() => {
          if (typeof Float32Array === "undefined") {
            return o;
          } else {
            return Float32Array;
          }
        })(),
        "%Float64Array%": (() => {
          if (typeof Float64Array === "undefined") {
            return o;
          } else {
            return Float64Array;
          }
        })(),
        "%FinalizationRegistry%": (() => {
          if (typeof FinalizationRegistry === "undefined") {
            return o;
          } else {
            return FinalizationRegistry;
          }
        })(),
        "%Function%": z,
        "%GeneratorFunction%": L,
        "%Int8Array%": (() => {
          if (typeof Int8Array === "undefined") {
            return o;
          } else {
            return Int8Array;
          }
        })(),
        "%Int16Array%": (() => {
          if (typeof Int16Array === "undefined") {
            return o;
          } else {
            return Int16Array;
          }
        })(),
        "%Int32Array%": (() => {
          if (typeof Int32Array === "undefined") {
            return o;
          } else {
            return Int32Array;
          }
        })(),
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": (() => {
          if (_ && x) {
            return x(x([][Symbol.iterator]()));
          } else {
            return o;
          }
        })(),
        "%JSON%": (() => {
          if (typeof JSON === "object") {
            return JSON;
          } else {
            return o;
          }
        })(),
        "%Map%": (() => {
          if (typeof Map === "undefined") {
            return o;
          } else {
            return Map;
          }
        })(),
        "%MapIteratorPrototype%": (() => {
          if (typeof Map !== "undefined" && _ && x) {
            return x(new Map()[Symbol.iterator]());
          } else {
            return o;
          }
        })(),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": a,
        "%Object.getOwnPropertyDescriptor%": g,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": (() => {
          if (typeof Promise === "undefined") {
            return o;
          } else {
            return Promise;
          }
        })(),
        "%Proxy%": (() => {
          if (typeof Proxy === "undefined") {
            return o;
          } else {
            return Proxy;
          }
        })(),
        "%RangeError%": s,
        "%ReferenceError%": c,
        "%Reflect%": (() => {
          if (typeof Reflect === "undefined") {
            return o;
          } else {
            return Reflect;
          }
        })(),
        "%RegExp%": RegExp,
        "%Set%": (() => {
          if (typeof Set === "undefined") {
            return o;
          } else {
            return Set;
          }
        })(),
        "%SetIteratorPrototype%": (() => {
          if (typeof Set !== "undefined" && _ && x) {
            return x(new Set()[Symbol.iterator]());
          } else {
            return o;
          }
        })(),
        "%SharedArrayBuffer%": (() => {
          if (typeof SharedArrayBuffer === "undefined") {
            return o;
          } else {
            return SharedArrayBuffer;
          }
        })(),
        "%String%": String,
        "%StringIteratorPrototype%": (() => {
          if (_ && x) {
            return x(""[Symbol.iterator]());
          } else {
            return o;
          }
        })(),
        "%Symbol%": (() => {
          if (_) {
            return Symbol;
          } else {
            return o;
          }
        })(),
        "%SyntaxError%": l,
        "%ThrowTypeError%": q,
        "%TypedArray%": S,
        "%TypeError%": u,
        "%Uint8Array%": (() => {
          if (typeof Uint8Array === "undefined") {
            return o;
          } else {
            return Uint8Array;
          }
        })(),
        "%Uint8ClampedArray%": (() => {
          if (typeof Uint8ClampedArray === "undefined") {
            return o;
          } else {
            return Uint8ClampedArray;
          }
        })(),
        "%Uint16Array%": (() => {
          if (typeof Uint16Array === "undefined") {
            return o;
          } else {
            return Uint16Array;
          }
        })(),
        "%Uint32Array%": (() => {
          if (typeof Uint32Array === "undefined") {
            return o;
          } else {
            return Uint32Array;
          }
        })(),
        "%URIError%": p,
        "%WeakMap%": (() => {
          if (typeof WeakMap === "undefined") {
            return o;
          } else {
            return WeakMap;
          }
        })(),
        "%WeakRef%": (() => {
          if (typeof WeakRef === "undefined") {
            return o;
          } else {
            return WeakRef;
          }
        })(),
        "%WeakSet%": (() => {
          if (typeof WeakSet === "undefined") {
            return o;
          } else {
            return WeakSet;
          }
        })(),
        "%Function.prototype.call%": k,
        "%Function.prototype.apply%": R,
        "%Object.defineProperty%": v,
        "%Object.getPrototypeOf%": W,
        "%Math.abs%": d,
        "%Math.floor%": f,
        "%Math.max%": b,
        "%Math.min%": M,
        "%Math.pow%": A,
        "%Math.round%": m,
        "%Math.sign%": h,
        "%Reflect.getPrototypeOf%": w
      };
      if (x) {
        try {
          null.error;
        } catch (Q) {
          var C = x(x(Q));
          N["%Error.prototype%"] = C;
        }
      }
      var E = function e(t) {
        var n;
        if (t === "%AsyncFunction%") {
          n = O("async function () {}");
        } else if (t === "%GeneratorFunction%") {
          n = O("function* () {}");
        } else if (t === "%AsyncGeneratorFunction%") {
          n = O("async function* () {}");
        } else if (t === "%AsyncGenerator%") {
          var o = e("%AsyncGeneratorFunction%");
          if (o) {
            n = o.prototype;
          }
        } else if (t === "%AsyncIteratorPrototype%") {
          var a = e("%AsyncGenerator%");
          if (a && x) {
            n = x(a.prototype);
          }
        }
        N[t] = n;
        return n;
      };
      var B = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var T = n(21277);
      var j = n(89670);
      var I = T.call(k, Array.prototype.concat);
      var D = T.call(R, Array.prototype.splice);
      var P = T.call(k, String.prototype.replace);
      var V = T.call(k, String.prototype.slice);
      var X = T.call(k, RegExp.prototype.exec);
      var Y = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var F = /\\(\\)?/g;
      function U(e) {
        var t = V(e, 0, 1);
        var n = V(e, -1);
        if (t === "%" && n !== "%") {
          throw new l("invalid intrinsic syntax, expected closing `%`");
        }
        if (n === "%" && t !== "%") {
          throw new l("invalid intrinsic syntax, expected opening `%`");
        }
        var o = [];
        P(e, Y, function (e, t, n, a) {
          o[o.length] = (() => {
            if (n) {
              return P(a, F, "$1");
            } else {
              return t || e;
            }
          })();
        });
        return o;
      }
      function H(e, t) {
        var n;
        var o = e;
        if (j(B, o)) {
          o = "%" + (n = B[o])[0] + "%";
        }
        if (j(N, o)) {
          var a = N[o];
          if (a === L) {
            a = E(o);
          }
          if (typeof a === "undefined" && !t) {
            throw new u("intrinsic " + e + " exists, but is not available. Please file an issue!");
          }
          return {
            alias: n,
            name: o,
            value: a
          };
        }
        throw new l("intrinsic " + e + " does not exist!");
      }
      e.exports = function (e, t) {
        if (typeof e !== "string" || e.length === 0) {
          throw new u("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof t !== "boolean") {
          throw new u("\"allowMissing\" argument must be a boolean");
        }