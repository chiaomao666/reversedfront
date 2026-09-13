
      var o;
      var a;
      var r;
      (function (i, s) {
        "use strict";

        (() => {
          if (e.exports) {
            return e.exports = s(n(72426));
          } else {
            a = [n(72426)];
            return (r = (() => {
              if (typeof (o = s) === "function") {
                return o.apply(t, a);
              } else {
                return o;
              }
            })()) === undefined || (e.exports = r);
          }
        })();
      })(0, function (e) {
        "use strict";

        if (e.version === undefined && e.default) {
          e = e.default;
        }
        var t;
        var n = {};
        var o = {};
        var a = {};
        var r = {};
        var i = {};
        if (!e || typeof e.version !== "string") {
          R("Moment Timezone requires Moment.js. See https://momentjs.com/timezone/docs/#/use-it/browser/");
        }
        var s = e.version.split(".");
        var c = +s[0];
        var l = +s[1];
        function u(e) {
          return (() => {
            if (e > 96) {
              return e - 87;
            } else {
              return (() => {
                if (e > 64) {
                  return e - 29;
                } else {
                  return e - 48;
                }
              })();
            }
          })();
        }
        function p(e) {
          var t = 0;
          var n = e.split(".");
          var o = n[0];
          var a = n[1] || "";
          var r = 1;
          var i = 0;
          var s = 1;
          for (e.charCodeAt(0) === 45 && (t = 1, s = -1); t < o.length; t++) {
            i = i * 60 + u(o.charCodeAt(t));
          }
          for (t = 0; t < a.length; t++) {
            r /= 60;
            i += u(a.charCodeAt(t)) * r;
          }
          return i * s;
        }
        function d(e) {
          for (var t = 0; t < e.length; t++) {
            e[t] = p(e[t]);
          }
        }
        function f(e, t) {
          var n;
          var o = [];
          for (n = 0; n < t.length; n++) {
            o[n] = e[t[n]];
          }
          return o;
        }
        function b(e) {
          var t = e.split("|");
          var n = t[2].split(" ");
          var o = t[3].split("");
          var a = t[4].split(" ");
          d(n);
          d(o);
          d(a);
          (function (e, t) {
            for (var n = 0; n < t; n++) {
              e[n] = Math.round((e[n - 1] || 0) + e[n] * 60000);
            }
            e[t - 1] = Infinity;
          })(a, o.length);
          return {
            name: t[0],
            abbrs: f(t[1].split(" "), o),
            offsets: f(n, o),
            untils: a,
            population: t[5] | 0
          };
        }
        function M(e) {
          if (e) {
            this._set(b(e));
          }
        }
        function A(e, t) {
          this.name = e;
          this.zones = t;
        }
        function m(e) {
          var t = e.toTimeString();
          var n = t.match(/\([a-z ]+\)/i);
          if ((n = (() => {
            if (n && n[0]) {
              return (() => {
                if (n = n[0].match(/[A-Z]/g)) {
                  return n.join("");
                } else {
                  return undefined;
                }
              })();
            } else {
              return (() => {
                if (n = t.match(/[A-Z]{3,5}/g)) {
                  return n[0];
                } else {
                  return undefined;
                }
              })();
            }
          })()) === "GMT") {
            n = undefined;
          }
          this.at = +e;
          this.abbr = n;
          this.offset = e.getTimezoneOffset();
        }
        function h(e) {
          this.zone = e;
          this.offsetScore = 0;
          this.abbrScore = 0;
        }
        function z(e, t) {
          var n;
          for (var o; o = ((t.at - e.at) / 120000 | 0) * 60000;) {
            (() => {
              if ((n = new m(new Date(e.at + o))).offset === e.offset) {
                return e = n;
              } else {
                return t = n;
              }
            })();
          }
          return e;
        }
        function O(e, t) {
          return (() => {
            if (e.offsetScore !== t.offsetScore) {
              return e.offsetScore - t.offsetScore;
            } else {
              return (() => {
                if (e.abbrScore !== t.abbrScore) {
                  return e.abbrScore - t.abbrScore;
                } else {
                  return (() => {
                    if (e.zone.population !== t.zone.population) {
                      return t.zone.population - e.zone.population;
                    } else {
                      return t.zone.name.localeCompare(e.zone.name);
                    }
                  })();
                }
              })();
            }
          })();
        }
        function g(e, t) {
          var n;
          var o;
          d(t);
          n = 0;
          for (; n < t.length; n++) {
            o = t[n];
            i[o] = i[o] || {};
            i[o][e] = true;
          }
        }
        function v(e) {
          var t;
          var n;
          var o;
          var a;
          var s = e.length;
          var c = {};
          var l = [];
          var u = {};
          for (t = 0; t < s; t++) {
            o = e[t].offset;
            if (!u.hasOwnProperty(o)) {
              for (n in a = i[o] || {}) {
                if (a.hasOwnProperty(n)) {
                  c[n] = true;
                }
              }
              u[o] = true;
            }
          }
          for (t in c) {
            if (c.hasOwnProperty(t)) {
              l.push(r[t]);
            }
          }
          return l;
        }
        function y() {
          try {
            var e = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (e && e.length > 3) {
              var t = r[q(e)];
              if (t) {
                return t;
              }
              R("Moment Timezone found " + e + " from the Intl api, but did not have that data loaded.");
            }
          } catch (u) {}
          var n;
          var o;
          var a;
          var i = function () {
            var e;
            var t;
            var n;
            var o;
            var a = new Date().getFullYear() - 2;
            var r = new m(new Date(a, 0, 1));
            var i = r.offset;
            var s = [r];
            for (o = 1; o < 48; o++) {
              if ((n = new Date(a, o, 1).getTimezoneOffset()) !== i) {
                e = z(r, t = new m(new Date(a, o, 1)));
                s.push(e);
                s.push(new m(new Date(e.at + 60000)));
                r = t;
                i = n;
              }
            }
            for (o = 0; o < 4; o++) {
              s.push(new m(new Date(a + o, 0, 1)));
              s.push(new m(new Date(a + o, 6, 1)));
            }
            return s;
          }();
          var s = i.length;
          var c = v(i);
          var l = [];
          for (o = 0; o < c.length; o++) {
            n = new h(x(c[o]), s);
            a = 0;
            for (; a < s; a++) {
              n.scoreOffsetAt(i[a]);
            }
            l.push(n);
          }
          l.sort(O);
          return (() => {
            if (l.length > 0) {
              return l[0].zone.name;
            } else {
              return undefined;
            }
          })();
        }
        function q(e) {
          return (e || "").toLowerCase().replace(/\//g, "_");
        }
        function _(e) {
          var t;
          var o;
          var a;
          var i;
          if (typeof e === "string") {
            e = [e];
          }
          t = 0;
          for (; t < e.length; t++) {
            i = q(o = (a = e[t].split("|"))[0]);
            n[i] = e[t];
            r[i] = o;
            g(i, a[2].split(" "));
          }
        }
        function x(e, t) {
          e = q(e);
          var a;
          var i = n[e];
          return (() => {
            if (i instanceof M) {
              return i;
            } else {
              return (() => {
                if (typeof i === "string") {
                  i = new M(i);
                  n[e] = i;
                  return i;
                } else {
                  return (() => {
                    if (o[e] && t !== x && (a = x(o[e], x))) {
                      (i = n[e] = new M())._set(a);
                      i.name = r[e];
                      return i;
                    } else {
                      return null;
                    }
                  })();
                }
              })();
            }
          })();
        }
        function W(e) {
          var t;
          var n;
          var a;
          var i;
          if (typeof e === "string") {
            e = [e];
          }
          t = 0;
          for (; t < e.length; t++) {
            a = q((n = e[t].split("|"))[0]);
            i = q(n[1]);
            o[a] = i;
            r[a] = n[0];
            o[i] = a;
            r[i] = n[1];
          }
        }
        function w(e) {
          var t = e._f === "X" || e._f === "x";
          return !!e._a && e._tzm === undefined && !t;
        }
        function R(e) {
          if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error(e);
          }
        }
        function k(t) {
          var n;
          var o = Array.prototype.slice.call(arguments, 0, -1);
          var a = arguments[arguments.length - 1];
          var r = e.utc.apply(null, o);
          if (!e.isMoment(t) && w(r) && (n = x(a))) {
            r.add(n.parse(r), "minutes");
          }
          r.tz(a);
          return r;
        }
        if (c < 2 || c === 2 && l < 6) {
          R("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js " + e.version + ". See momentjs.com");
        }
        M.prototype = {
          _set: function (e) {
            this.name = e.name;
            this.abbrs = e.abbrs;
            this.untils = e.untils;
            this.offsets = e.offsets;
            this.population = e.population;
          },
          _index: function (e) {
            var t;
            if ((t = function (e, t) {
              var n;
              var o = t.length;
              if (e < t[0]) {
                return 0;
              }
              if (o > 1 && t[o - 1] === Infinity && e >= t[o - 2]) {
                return o - 1;
              }
              if (e >= t[o - 1]) {
                return -1;
              }
              for (var a = 0, r = o - 1; r - a > 1;) {
                (() => {
                  if (t[n = Math.floor((a + r) / 2)] <= e) {
                    return a = n;
                  } else {
                    return r = n;
                  }
                })();
              }
              return r;
            }(+e, this.untils)) >= 0) {
              return t;
            }
          },
          countries: function () {
            var e = this.name;
            return Object.keys(a).filter(function (t) {
              return a[t].zones.indexOf(e) !== -1;
            });
          },
          parse: function (e) {
            var t;
            var n;
            var o;
            var a;
            var r = +e;
            var i = this.offsets;
            var s = this.untils;
            var c = s.length - 1;
            for (a = 0; a < c; a++) {
              t = i[a];
              n = i[a + 1];
              o = i[(() => {
                if (a) {
                  return a - 1;
                } else {
                  return a;
                }
              })()];
              (() => {
                if (t < n && k.moveAmbiguousForward) {
                  return t = n;
                } else {
                  return t > o && k.moveInvalidForward && (t = o);
                }
              })();
              if (r < s[a] - t * 60000) {
                return i[a];
              }
            }
            return i[c];
          },
          abbr: function (e) {
            return this.abbrs[this._index(e)];
          },
          offset: function (e) {
            R("zone.offset has been deprecated in favor of zone.utcOffset");
            return this.offsets[this._index(e)];
          },
          utcOffset: function (e) {
            return this.offsets[this._index(e)];
          }
        };
        h.prototype.scoreOffsetAt = function (e) {
          this.offsetScore += Math.abs(this.zone.utcOffset(e.at) - e.offset);
          if (this.zone.abbr(e.at).replace(/[^A-Z]/g, "") !== e.abbr) {
            this.abbrScore++;
          }
        };
        k.version = "0.5.45";
        k.dataVersion = "";
        k._zones = n;
        k._links = o;
        k._names = r;
        k._countries = a;
        k.add = _;
        k.link = W;
        k.load = function (e) {
          _(e.zones);
          W(e.links);
          (function (e) {
            var t;
            var n;
            var o;
            var r;
            if (e && e.length) {
              for (t = 0; t < e.length; t++) {
                n = (r = e[t].split("|"))[0].toUpperCase();
                o = r[1].split(" ");
                a[n] = new A(n, o);
              }
            }
          })(e.countries);
          k.dataVersion = e.version;
        };
        k.zone = x;
        k.zoneExists = function e(t) {
          if (!e.didShowError) {
            e.didShowError = true;
            R("moment.tz.zoneExists('" + t + "') has been deprecated in favor of !moment.tz.zone('" + t + "')");
          }
          return !!x(t);
        };
        k.guess = function (e) {
          if (!t || !!e) {
            t = y();
          }
          return t;
        };
        k.names = function () {
          var e;
          var t = [];
          for (e in r) {
            if (r.hasOwnProperty(e) && (n[e] || n[o[e]]) && r[e]) {
              t.push(r[e]);
            }
          }
          return t.sort();
        };
        k.Zone = M;
        k.unpack = b;
        k.unpackBase60 = p;
        k.needsOffset = w;
        k.moveInvalidForward = true;
        k.moveAmbiguousForward = false;
        k.countries = function () {
          return Object.keys(a);
        };
        k.zonesForCountry = function (e, t) {
          var n;
          n = (n = e).toUpperCase();
          if (!(e = a[n] || null)) {
            return null;
          }
          var o = e.zones.sort();
          return (() => {
            if (t) {
              return o.map(function (e) {
                return {
                  name: e,
                  offset: x(e).utcOffset(new Date())
                };
              });
            } else {
              return o;
            }
          })();
        };
        var L;
        var S = e.fn;
        function N(e) {
          return function () {
            return (() => {
              if (this._z) {
                return this._z.abbr(this);
              } else {
                return e.call(this);
              }
            })();
          };
        }
        function C(e) {
          return function () {
            this._z = null;
            return e.apply(this, arguments);
          };
        }
        e.tz = k;
        e.defaultZone = null;
        e.updateOffset = function (t, n) {
          var o;
          var a = e.defaultZone;
          if (t._z === undefined) {
            if (a && w(t) && !t._isUTC && t.isValid()) {
              t._d = e.utc(t._a)._d;
              t.utc().add(a.parse(t), "minutes");
            }
            t._z = a;
          }
          if (t._z) {
            o = t._z.utcOffset(t);
            if (Math.abs(o) < 16) {
              o /= 60;
            }
            if (t.utcOffset !== undefined) {
              var r = t._z;
              t.utcOffset(-o, n);
              t._z = r;
            } else {
              t.zone(o, n);
            }
          }
        };
        S.tz = function (t, n) {
          if (t) {
            if (typeof t !== "string") {
              throw new Error("Time zone name must be a string, got " + t + " [" + typeof t + "]");
            }
            this._z = x(t);
            (() => {
              if (this._z) {
                return e.updateOffset(this, n);
              } else {
                return R("Moment Timezone has no data for " + t + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
              }
            })();
            return this;
          }
          if (this._z) {
            return this._z.name;
          }
        };
        S.zoneName = N(S.zoneName);
        S.zoneAbbr = N(S.zoneAbbr);
        S.utc = C(S.utc);
        S.local = C(S.local);
        L = S.utcOffset;
        S.utcOffset = function () {
          if (arguments.length > 0) {
            this._z = null;
          }
          return L.apply(this, arguments);
        };
        e.tz.setDefault = function (t) {
          if (c < 2 || c === 2 && l < 9) {
            R("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js " + e.version + ".");
          }
          e.defaultZone = (() => {
            if (t) {
              return x(t);
            } else {
              return null;
            }
          })();
          return e;
        };
        var E = e.momentProperties;
        (() => {
          if (Object.prototype.toString.call(E) === "[object Array]") {
            E.push("_z");
            return E.push("_a");
          } else {
            return E && (E._z = null);
          }
        })();
        return e;
      });
    }