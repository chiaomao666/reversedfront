
      "use strict";

      var o = n(59874);
      var a = Object.prototype.hasOwnProperty;
      var r = Array.isArray;
      var i = function () {
        var e = [];
        for (var t = 0; t < 256; ++t) {
          e.push("%" + ((() => {
            if (t < 16) {
              return "0";
            } else {
              return "";
            }
          })() + t.toString(16)).toUpperCase());
        }
        return e;
      }();
      function s(e, t) {
        var n = (() => {
          if (t && t.plainObjects) {
            return {
              __proto__: null
            };
          } else {
            return {};
          }
        })();
        for (var o = 0; o < e.length; ++o) {
          if (typeof e[o] !== "undefined") {
            n[o] = e[o];
          }
        }
        return n;
      }
      var c = 1024;
      e.exports = {
        arrayToObject: s,
        assign: function (e, t) {
          return Object.keys(t).reduce(function (e, n) {
            e[n] = t[n];
            return e;
          }, e);
        },
        combine: function (e, t) {
          return [].concat(e, t);
        },
        compact: function (e) {
          for (var t = [{
              obj: {
                o: e
              },
              prop: "o"
            }], n = [], o = 0; o < t.length; ++o) {
            var a = t[o];
            var i = a.obj[a.prop];
            for (var s = Object.keys(i), c = 0; c < s.length; ++c) {
              var l = s[c];
              var u = i[l];
              if (typeof u === "object" && u !== null && n.indexOf(u) === -1) {
                t.push({
                  obj: i,
                  prop: l
                });
                n.push(u);
              }
            }
          }
          (function (e) {
            while (e.length > 1) {
              var t = e.pop();
              var n = t.obj[t.prop];
              if (r(n)) {
                var o = [];
                for (var a = 0; a < n.length; ++a) {
                  if (typeof n[a] !== "undefined") {
                    o.push(n[a]);
                  }
                }
                t.obj[t.prop] = o;
              }
            }
          })(t);
          return e;
        },
        decode: function (e, t, n) {
          var o = e.replace(/\+/g, " ");
          if (n === "iso-8859-1") {
            return o.replace(/%[0-9a-f]{2}/gi, unescape);
          }
          try {
            return decodeURIComponent(o);
          } catch (a) {
            return o;
          }
        },
        encode: function (e, t, n, a, r) {
          if (e.length === 0) {
            return e;
          }
          var s = e;
          (() => {
            if (typeof e === "symbol") {
              return s = Symbol.prototype.toString.call(e);
            } else {
              return typeof e !== "string" && (s = String(e));
            }
          })();
          if (n === "iso-8859-1") {
            return escape(s).replace(/%u[0-9a-f]{4}/gi, function (e) {
              return "%26%23" + parseInt(e.slice(2), 16) + "%3B";
            });
          }
          var l = "";
          for (var u = 0; u < s.length; u += c) {
            for (var p = (() => {
                if (s.length >= c) {
                  return s.slice(u, u + c);
                } else {
                  return s;
                }
              })(), d = [], f = 0; f < p.length; ++f) {
              var b = p.charCodeAt(f);
              (() => {
                if (b === 45 || b === 46 || b === 95 || b === 126 || b >= 48 && b <= 57 || b >= 65 && b <= 90 || b >= 97 && b <= 122 || r === o.RFC1738 && (b === 40 || b === 41)) {
                  return d[d.length] = p.charAt(f);
                } else {
                  return (() => {
                    if (b < 128) {
                      return d[d.length] = i[b];
                    } else {
                      return (() => {
                        if (b < 2048) {
                          return d[d.length] = i[b >> 6 | 192] + i[b & 63 | 128];
                        } else {
                          return (() => {
                            if (b < 55296 || b >= 57344) {
                              return d[d.length] = i[b >> 12 | 224] + i[b >> 6 & 63 | 128] + i[b & 63 | 128];
                            } else {
                              f += 1;
                              b = 65536 + ((b & 1023) << 10 | p.charCodeAt(f) & 1023);
                              return d[d.length] = i[b >> 18 | 240] + i[b >> 12 & 63 | 128] + i[b >> 6 & 63 | 128] + i[b & 63 | 128];
                            }
                          })();
                        }
                      })();
                    }
                  })();
                }
              })();
            }
            l += d.join("");
          }
          return l;
        },
        isBuffer: function (e) {
          return !!e && typeof e === "object" && !!e.constructor && !!e.constructor.isBuffer && !!e.constructor.isBuffer(e);
        },
        isRegExp: function (e) {
          return Object.prototype.toString.call(e) === "[object RegExp]";
        },
        maybeMap: function (e, t) {
          if (r(e)) {
            var n = [];
            for (var o = 0; o < e.length; o += 1) {
              n.push(t(e[o]));
            }
            return n;
          }
          return t(e);
        },
        merge: function e(t, n, o) {
          if (!n) {
            return t;
          }
          if (typeof n !== "object" && typeof n !== "function") {
            if (r(t)) {
              t.push(n);
            } else {
              if (!t || typeof t !== "object") {
                return [t, n];
              }
              if (o && (o.plainObjects || o.allowPrototypes) || !a.call(Object.prototype, n)) {
                t[n] = true;
              }
            }
            return t;
          }
          if (!t || typeof t !== "object") {
            return [t].concat(n);
          }
          var i = t;
          if (r(t) && !r(n)) {
            i = s(t, o);
          }
          return (() => {
            if (r(t) && r(n)) {
              n.forEach(function (n, r) {
                if (a.call(t, r)) {
                  var i = t[r];
                  (() => {
                    if (i && typeof i === "object" && n && typeof n === "object") {
                      return t[r] = e(i, n, o);
                    } else {
                      return t.push(n);
                    }
                  })();
                } else {
                  t[r] = n;
                }
              });
              return t;
            } else {
              return Object.keys(n).reduce(function (t, r) {
                var i = n[r];
                (() => {
                  if (a.call(t, r)) {
                    return t[r] = e(t[r], i, o);
                  } else {
                    return t[r] = i;
                  }
                })();
                return t;
              }, i);
            }
          })();
        }
      };
    }