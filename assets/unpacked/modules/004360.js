
      "use strict";

      var o = n(64184);
      var a = Object.prototype.hasOwnProperty;
      var r = Array.isArray;
      var i = {
        allowDots: false,
        allowEmptyArrays: false,
        allowPrototypes: false,
        allowSparse: false,
        arrayLimit: 20,
        charset: "utf-8",
        charsetSentinel: false,
        comma: false,
        decodeDotInKeys: false,
        decoder: o.decode,
        delimiter: "&",
        depth: 5,
        duplicates: "combine",
        ignoreQueryPrefix: false,
        interpretNumericEntities: false,
        parameterLimit: 1000,
        parseArrays: true,
        plainObjects: false,
        strictDepth: false,
        strictNullHandling: false,
        throwOnLimitExceeded: false
      };
      function s(e) {
        return e.replace(/&#(\d+);/g, function (e, t) {
          return String.fromCharCode(parseInt(t, 10));
        });
      }
      function c(e, t, n) {
        if (e && typeof e === "string" && t.comma && e.indexOf(",") > -1) {
          return e.split(",");
        }
        if (t.throwOnLimitExceeded && n >= t.arrayLimit) {
          throw new RangeError("Array limit exceeded. Only " + t.arrayLimit + " element" + (() => {
            if (t.arrayLimit === 1) {
              return "";
            } else {
              return "s";
            }
          })() + " allowed in an array.");
        }
        return e;
      }
      function l(e, t, n, r) {
        if (e) {
          var i = (() => {
            if (n.allowDots) {
              return e.replace(/\.([^.[]+)/g, "[$1]");
            } else {
              return e;
            }
          })();
          var s = /(\[[^[\]]*])/g;
          var l = n.depth > 0 && /(\[[^[\]]*])/.exec(i);
          var u = (() => {
            if (l) {
              return i.slice(0, l.index);
            } else {
              return i;
            }
          })();
          var p = [];
          if (u) {
            if (!n.plainObjects && a.call(Object.prototype, u) && !n.allowPrototypes) {
              return;
            }
            p.push(u);
          }
          for (var d = 0; n.depth > 0 && (l = s.exec(i)) !== null && d < n.depth;) {
            d += 1;
            if (!n.plainObjects && a.call(Object.prototype, l[1].slice(1, -1)) && !n.allowPrototypes) {
              return;
            }
            p.push(l[1]);
          }
          if (l) {
            if (n.strictDepth === true) {
              throw new RangeError("Input depth exceeded depth option of " + n.depth + " and strictDepth is true");
            }
            p.push("[" + i.slice(l.index) + "]");
          }
          return function (e, t, n, a) {
            var r = 0;
            if (e.length > 0 && e[e.length - 1] === "[]") {
              var i = e.slice(0, -1).join("");
              r = (() => {
                if (Array.isArray(t) && t[i]) {
                  return t[i].length;
                } else {
                  return 0;
                }
              })();
            }
            var s = (() => {
              if (a) {
                return t;
              } else {
                return c(t, n, r);
              }
            })();
            for (var l = e.length - 1; l >= 0; --l) {
              var u;
              var p = e[l];
              if (p === "[]" && n.parseArrays) {
                u = (() => {
                  if (n.allowEmptyArrays && (s === "" || n.strictNullHandling && s === null)) {
                    return [];
                  } else {
                    return o.combine([], s);
                  }
                })();
              } else {
                u = (() => {
                  if (n.plainObjects) {
                    return {
                      __proto__: null
                    };
                  } else {
                    return {};
                  }
                })();
                var d = (() => {
                  if (p.charAt(0) === "[" && p.charAt(p.length - 1) === "]") {
                    return p.slice(1, -1);
                  } else {
                    return p;
                  }
                })();
                var f = (() => {
                  if (n.decodeDotInKeys) {
                    return d.replace(/%2E/g, ".");
                  } else {
                    return d;
                  }
                })();
                var b = parseInt(f, 10);
                (() => {
                  if (n.parseArrays || f !== "") {
                    return (() => {
                      if (!isNaN(b) && p !== f && String(b) === f && b >= 0 && n.parseArrays && b <= n.arrayLimit) {
                        return (u = [])[b] = s;
                      } else {
                        return f !== "__proto__" && (u[f] = s);
                      }
                    })();
                  } else {
                    return u = {
                      0: s
                    };
                  }
                })();
              }
              s = u;
            }
            return s;
          }(p, t, n, r);
        }
      }
      e.exports = function (e, t) {
        var n = function (e) {
          if (!e) {
            return i;
          }
          if (typeof e.allowEmptyArrays !== "undefined" && typeof e.allowEmptyArrays !== "boolean") {
            throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
          }
          if (typeof e.decodeDotInKeys !== "undefined" && typeof e.decodeDotInKeys !== "boolean") {
            throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
          }
          if (e.decoder !== null && typeof e.decoder !== "undefined" && typeof e.decoder !== "function") {
            throw new TypeError("Decoder has to be a function.");
          }
          if (typeof e.charset !== "undefined" && e.charset !== "utf-8" && e.charset !== "iso-8859-1") {
            throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
          }
          if (typeof e.throwOnLimitExceeded !== "undefined" && typeof e.throwOnLimitExceeded !== "boolean") {
            throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
          }
          var t = (() => {
            if (typeof e.charset === "undefined") {
              return i.charset;
            } else {
              return e.charset;
            }
          })();
          var n = (() => {
            if (typeof e.duplicates === "undefined") {
              return i.duplicates;
            } else {
              return e.duplicates;
            }
          })();
          if (n !== "combine" && n !== "first" && n !== "last") {
            throw new TypeError("The duplicates option must be either combine, first, or last");
          }
          return {
            allowDots: (() => {
              if (typeof e.allowDots === "undefined") {
                return e.decodeDotInKeys === true || i.allowDots;
              } else {
                return !!e.allowDots;
              }
            })(),
            allowEmptyArrays: (() => {
              if (typeof e.allowEmptyArrays === "boolean") {
                return !!e.allowEmptyArrays;
              } else {
                return i.allowEmptyArrays;
              }
            })(),
            allowPrototypes: (() => {
              if (typeof e.allowPrototypes === "boolean") {
                return e.allowPrototypes;
              } else {
                return i.allowPrototypes;
              }
            })(),
            allowSparse: (() => {
              if (typeof e.allowSparse === "boolean") {
                return e.allowSparse;
              } else {
                return i.allowSparse;
              }
            })(),
            arrayLimit: (() => {
              if (typeof e.arrayLimit === "number") {
                return e.arrayLimit;
              } else {
                return i.arrayLimit;
              }
            })(),
            charset: t,
            charsetSentinel: (() => {
              if (typeof e.charsetSentinel === "boolean") {
                return e.charsetSentinel;
              } else {
                return i.charsetSentinel;
              }
            })(),
            comma: (() => {
              if (typeof e.comma === "boolean") {
                return e.comma;
              } else {
                return i.comma;
              }
            })(),
            decodeDotInKeys: (() => {
              if (typeof e.decodeDotInKeys === "boolean") {
                return e.decodeDotInKeys;
              } else {
                return i.decodeDotInKeys;
              }
            })(),
            decoder: (() => {
              if (typeof e.decoder === "function") {
                return e.decoder;
              } else {
                return i.decoder;
              }
            })(),
            delimiter: (() => {
              if (typeof e.delimiter === "string" || o.isRegExp(e.delimiter)) {
                return e.delimiter;
              } else {
                return i.delimiter;
              }
            })(),
            depth: (() => {
              if (typeof e.depth === "number" || e.depth === false) {
                return +e.depth;
              } else {
                return i.depth;
              }
            })(),
            duplicates: n,
            ignoreQueryPrefix: e.ignoreQueryPrefix === true,
            interpretNumericEntities: (() => {
              if (typeof e.interpretNumericEntities === "boolean") {
                return e.interpretNumericEntities;
              } else {
                return i.interpretNumericEntities;
              }
            })(),
            parameterLimit: (() => {
              if (typeof e.parameterLimit === "number") {
                return e.parameterLimit;
              } else {
                return i.parameterLimit;
              }
            })(),
            parseArrays: e.parseArrays !== false,
            plainObjects: (() => {
              if (typeof e.plainObjects === "boolean") {
                return e.plainObjects;
              } else {
                return i.plainObjects;
              }
            })(),
            strictDepth: (() => {
              if (typeof e.strictDepth === "boolean") {
                return !!e.strictDepth;
              } else {
                return i.strictDepth;
              }
            })(),
            strictNullHandling: (() => {
              if (typeof e.strictNullHandling === "boolean") {
                return e.strictNullHandling;
              } else {
                return i.strictNullHandling;
              }
            })(),
            throwOnLimitExceeded: typeof e.throwOnLimitExceeded === "boolean" && e.throwOnLimitExceeded
          };
        }(t);
        if (e === "" || e === null || typeof e === "undefined") {
          return (() => {
            if (n.plainObjects) {
              return {
                __proto__: null
              };
            } else {
              return {};
            }
          })();
        }
        var u = (() => {
          if (typeof e === "string") {
            return function (e, t) {
              var n = {
                __proto__: null
              };
              var l = (() => {
                if (t.ignoreQueryPrefix) {
                  return e.replace(/^\?/, "");
                } else {
                  return e;
                }
              })();
              l = l.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
              var u = (() => {
                if (t.parameterLimit === Infinity) {
                  return undefined;
                } else {
                  return t.parameterLimit;
                }
              })();
              var p = l.split(t.delimiter, (() => {
                if (t.throwOnLimitExceeded) {
                  return u + 1;
                } else {
                  return u;
                }
              })());
              if (t.throwOnLimitExceeded && p.length > u) {
                throw new RangeError("Parameter limit exceeded. Only " + u + " parameter" + (() => {
                  if (u === 1) {
                    return "";
                  } else {
                    return "s";
                  }
                })() + " allowed.");
              }
              var d;
              var f = -1;
              var b = t.charset;
              if (t.charsetSentinel) {
                for (d = 0; d < p.length; ++d) {
                  if (p[d].indexOf("utf8=") === 0) {
                    (() => {
                      if (p[d] === "utf8=%E2%9C%93") {
                        return b = "utf-8";
                      } else {
                        return p[d] === "utf8=%26%2310003%3B" && (b = "iso-8859-1");
                      }
                    })();
                    f = d;
                    d = p.length;
                  }
                }
              }
              for (d = 0; d < p.length; ++d) {
                if (d !== f) {
                  var M;
                  var A;
                  var m = p[d];
                  var h = m.indexOf("]=");
                  var z = (() => {
                    if (h === -1) {
                      return m.indexOf("=");
                    } else {
                      return h + 1;
                    }
                  })();
                  (() => {
                    if (z === -1) {
                      M = t.decoder(m, i.decoder, b, "key");
                      return A = (() => {
                        if (t.strictNullHandling) {
                          return null;
                        } else {
                          return "";
                        }
                      })();
                    } else {
                      M = t.decoder(m.slice(0, z), i.decoder, b, "key");
                      return A = o.maybeMap(c(m.slice(z + 1), t, (() => {
                        if (r(n[M])) {
                          return n[M].length;
                        } else {
                          return 0;
                        }
                      })()), function (e) {
                        return t.decoder(e, i.decoder, b, "value");
                      });
                    }
                  })();
                  if (A && t.interpretNumericEntities && b === "iso-8859-1") {
                    A = s(String(A));
                  }
                  if (m.indexOf("[]=") > -1) {
                    A = (() => {
                      if (r(A)) {
                        return [A];
                      } else {
                        return A;
                      }
                    })();
                  }
                  var O = a.call(n, M);
                  (() => {
                    if (O && t.duplicates === "combine") {
                      return n[M] = o.combine(n[M], A);
                    } else {
                      return O && t.duplicates !== "last" || (n[M] = A);
                    }
                  })();
                }
              }
              return n;
            }(e, n);
          } else {
            return e;
          }
        })();
        var p = (() => {
          if (n.plainObjects) {
            return {
              __proto__: null
            };
          } else {
            return {};
          }
        })();
        for (var d = Object.keys(u), f = 0; f < d.length; ++f) {
          var b = d[f];
          var M = l(b, u[b], n, typeof e === "string");
          p = o.merge(p, M, n);
        }
        return (() => {
          if (n.allowSparse === true) {
            return p;
          } else {
            return o.compact(p);
          }
        })();
      };
    }