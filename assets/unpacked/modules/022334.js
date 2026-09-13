
      "use strict";

      var o = n(87510);
      var a = n(64184);
      var r = n(59874);
      var i = Object.prototype.hasOwnProperty;
      var s = {
        brackets: function (e) {
          return e + "[]";
        },
        comma: "comma",
        indices: function (e, t) {
          return e + "[" + t + "]";
        },
        repeat: function (e) {
          return e;
        }
      };
      var c = Array.isArray;
      var l = Array.prototype.push;
      function u(e, t) {
        l.apply(e, (() => {
          if (c(t)) {
            return t;
          } else {
            return [t];
          }
        })());
      }
      var p = Date.prototype.toISOString;
      var d = r.default;
      var f = {
        addQueryPrefix: false,
        allowDots: false,
        allowEmptyArrays: false,
        arrayFormat: "indices",
        charset: "utf-8",
        charsetSentinel: false,
        commaRoundTrip: false,
        delimiter: "&",
        encode: true,
        encodeDotInKeys: false,
        encoder: a.encode,
        encodeValuesOnly: false,
        filter: undefined,
        format: d,
        formatter: r.formatters[d],
        indices: false,
        serializeDate: function (e) {
          return p.call(e);
        },
        skipNulls: false,
        strictNullHandling: false
      };
      var b = {};
      var M = function e(t, n, r, i, s, l, p, d, M, A, m, h, z, O, g, v, y, q) {
        var _;
        var x = t;
        for (var W = q, w = 0, R = false; (W = W.get(b)) !== undefined && !R;) {
          var k = W.get(t);
          w += 1;
          if (typeof k !== "undefined") {
            if (k === w) {
              throw new RangeError("Cyclic object value");
            }
            R = true;
          }
          if (typeof W.get(b) === "undefined") {
            w = 0;
          }
        }
        (() => {
          if (typeof A === "function") {
            return x = A(n, x);
          } else {
            return (() => {
              if (x instanceof Date) {
                return x = z(x);
              } else {
                return r === "comma" && c(x) && (x = a.maybeMap(x, function (e) {
                  return (() => {
                    if (e instanceof Date) {
                      return z(e);
                    } else {
                      return e;
                    }
                  })();
                }));
              }
            })();
          }
        })();
        if (x === null) {
          if (l) {
            return (() => {
              if (M && !v) {
                return M(n, f.encoder, y, "key", O);
              } else {
                return n;
              }
            })();
          }
          x = "";
        }
        if (typeof (_ = x) === "string" || typeof _ === "number" || typeof _ === "boolean" || typeof _ === "symbol" || typeof _ === "bigint" || a.isBuffer(x)) {
          return (() => {
            if (M) {
              return [g((() => {
                if (v) {
                  return n;
                } else {
                  return M(n, f.encoder, y, "key", O);
                }
              })()) + "=" + g(M(x, f.encoder, y, "value", O))];
            } else {
              return [g(n) + "=" + g(String(x))];
            }
          })();
        }
        var L;
        var S = [];
        if (typeof x === "undefined") {
          return S;
        }
        if (r === "comma" && c(x)) {
          if (v && M) {
            x = a.maybeMap(x, M);
          }
          L = [{
            value: (() => {
              if (x.length > 0) {
                return x.join(",") || null;
              } else {
                return undefined;
              }
            })()
          }];
        } else if (c(A)) {
          L = A;
        } else {
          var N = Object.keys(x);
          L = (() => {
            if (m) {
              return N.sort(m);
            } else {
              return N;
            }
          })();
        }
        var C = (() => {
          if (d) {
            return String(n).replace(/\./g, "%2E");
          } else {
            return String(n);
          }
        })();
        var E = (() => {
          if (i && c(x) && x.length === 1) {
            return C + "[]";
          } else {
            return C;
          }
        })();
        if (s && c(x) && x.length === 0) {
          return E + "[]";
        }
        for (var B = 0; B < L.length; ++B) {
          var T = L[B];
          var j = (() => {
            if (typeof T === "object" && T && typeof T.value !== "undefined") {
              return T.value;
            } else {
              return x[T];
            }
          })();
          if (!p || j !== null) {
            var I = (() => {
              if (h && d) {
                return String(T).replace(/\./g, "%2E");
              } else {
                return String(T);
              }
            })();
            var D = (() => {
              if (c(x)) {
                return (() => {
                  if (typeof r === "function") {
                    return r(E, I);
                  } else {
                    return E;
                  }
                })();
              } else {
                return E + (() => {
                  if (h) {
                    return "." + I;
                  } else {
                    return "[" + I + "]";
                  }
                })();
              }
            })();
            q.set(t, w);
            var P = o();
            P.set(b, q);
            u(S, e(j, D, r, i, s, l, p, d, (() => {
              if (r === "comma" && v && c(x)) {
                return null;
              } else {
                return M;
              }
            })(), A, m, h, z, O, g, v, y, P));
          }
        }
        return S;
      };
      e.exports = function (e, t) {
        var n;
        var a = e;
        var l = function (e) {
          if (!e) {
            return f;
          }
          if (typeof e.allowEmptyArrays !== "undefined" && typeof e.allowEmptyArrays !== "boolean") {
            throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
          }
          if (typeof e.encodeDotInKeys !== "undefined" && typeof e.encodeDotInKeys !== "boolean") {
            throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
          }
          if (e.encoder !== null && typeof e.encoder !== "undefined" && typeof e.encoder !== "function") {
            throw new TypeError("Encoder has to be a function.");
          }
          var t = e.charset || f.charset;
          if (typeof e.charset !== "undefined" && e.charset !== "utf-8" && e.charset !== "iso-8859-1") {
            throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
          }
          var n = r.default;
          if (typeof e.format !== "undefined") {
            if (!i.call(r.formatters, e.format)) {
              throw new TypeError("Unknown format option provided.");
            }
            n = e.format;
          }
          var o;
          var a = r.formatters[n];
          var l = f.filter;
          if (typeof e.filter === "function" || c(e.filter)) {
            l = e.filter;
          }
          o = (() => {
            if (e.arrayFormat in s) {
              return e.arrayFormat;
            } else {
              return (() => {
                if ("indices" in e) {
                  return (() => {
                    if (e.indices) {
                      return "indices";
                    } else {
                      return "repeat";
                    }
                  })();
                } else {
                  return f.arrayFormat;
                }
              })();
            }
          })();
          if ("commaRoundTrip" in e && typeof e.commaRoundTrip !== "boolean") {
            throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
          }
          var u = (() => {
            if (typeof e.allowDots === "undefined") {
              return e.encodeDotInKeys === true || f.allowDots;
            } else {
              return !!e.allowDots;
            }
          })();
          return {
            addQueryPrefix: (() => {
              if (typeof e.addQueryPrefix === "boolean") {
                return e.addQueryPrefix;
              } else {
                return f.addQueryPrefix;
              }
            })(),
            allowDots: u,
            allowEmptyArrays: (() => {
              if (typeof e.allowEmptyArrays === "boolean") {
                return !!e.allowEmptyArrays;
              } else {
                return f.allowEmptyArrays;
              }
            })(),
            arrayFormat: o,
            charset: t,
            charsetSentinel: (() => {
              if (typeof e.charsetSentinel === "boolean") {
                return e.charsetSentinel;
              } else {
                return f.charsetSentinel;
              }
            })(),
            commaRoundTrip: !!e.commaRoundTrip,
            delimiter: (() => {
              if (typeof e.delimiter === "undefined") {
                return f.delimiter;
              } else {
                return e.delimiter;
              }
            })(),
            encode: (() => {
              if (typeof e.encode === "boolean") {
                return e.encode;
              } else {
                return f.encode;
              }
            })(),
            encodeDotInKeys: (() => {
              if (typeof e.encodeDotInKeys === "boolean") {
                return e.encodeDotInKeys;
              } else {
                return f.encodeDotInKeys;
              }
            })(),
            encoder: (() => {
              if (typeof e.encoder === "function") {
                return e.encoder;
              } else {
                return f.encoder;
              }
            })(),
            encodeValuesOnly: (() => {
              if (typeof e.encodeValuesOnly === "boolean") {
                return e.encodeValuesOnly;
              } else {
                return f.encodeValuesOnly;
              }
            })(),
            filter: l,
            format: n,
            formatter: a,
            serializeDate: (() => {
              if (typeof e.serializeDate === "function") {
                return e.serializeDate;
              } else {
                return f.serializeDate;
              }
            })(),
            skipNulls: (() => {
              if (typeof e.skipNulls === "boolean") {
                return e.skipNulls;
              } else {
                return f.skipNulls;
              }
            })(),
            sort: (() => {
              if (typeof e.sort === "function") {
                return e.sort;
              } else {
                return null;
              }
            })(),
            strictNullHandling: (() => {
              if (typeof e.strictNullHandling === "boolean") {
                return e.strictNullHandling;
              } else {
                return f.strictNullHandling;
              }
            })()
          };
        }(t);
        (() => {
          if (typeof l.filter === "function") {
            return a = (0, l.filter)("", a);
          } else {
            return c(l.filter) && (n = l.filter);
          }
        })();
        var p = [];
        if (typeof a !== "object" || a === null) {
          return "";
        }
        var d = s[l.arrayFormat];
        var b = d === "comma" && l.commaRoundTrip;
        n ||= Object.keys(a);
        if (l.sort) {
          n.sort(l.sort);
        }
        var A = o();
        for (var m = 0; m < n.length; ++m) {
          var h = n[m];
          var z = a[h];
          if (!l.skipNulls || z !== null) {
            u(p, M(z, h, d, b, l.allowEmptyArrays, l.strictNullHandling, l.skipNulls, l.encodeDotInKeys, (() => {
              if (l.encode) {
                return l.encoder;
              } else {
                return null;
              }
            })(), l.filter, l.sort, l.allowDots, l.serializeDate, l.format, l.formatter, l.encodeValuesOnly, l.charset, A));
          }
        }
        var O = p.join(l.delimiter);
        var g = (() => {
          if (l.addQueryPrefix === true) {
            return "?";
          } else {
            return "";
          }
        })();
        if (l.charsetSentinel) {
          (() => {
            if (l.charset === "iso-8859-1") {
              return g += "utf8=%26%2310003%3B&";
            } else {
              return g += "utf8=%E2%9C%93&";
            }
          })();
        }
        return (() => {
          if (O.length > 0) {
            return g + O;
          } else {
            return "";
          }
        })();
      };
    }