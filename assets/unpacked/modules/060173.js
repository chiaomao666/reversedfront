
      "use strict";

      var o;
      var a = n(72791);
      var r = (() => {
        if ((o = a) && typeof o === "object" && "default" in o) {
          return o.default;
        } else {
          return o;
        }
      })();
      var i = n(1338);
      var s = new i();
      var c = s.getBrowser();
      var l = s.getCPU();
      var u = s.getDevice();
      var p = s.getEngine();
      var d = s.getOS();
      var f = s.getUA();
      function b(e) {
        return s.setUA(e);
      }
      function M(e) {
        if (e) {
          var t = new i(e);
          return {
            UA: t,
            browser: t.getBrowser(),
            cpu: t.getCPU(),
            device: t.getDevice(),
            engine: t.getEngine(),
            os: t.getOS(),
            ua: t.getUA(),
            setUserAgent: function (e) {
              return t.setUA(e);
            }
          };
        }
        console.error("No userAgent string was provided");
      }
      var A = Object.freeze({
        ClientUAInstance: s,
        browser: c,
        cpu: l,
        device: u,
        engine: p,
        os: d,
        ua: f,
        setUa: b,
        parseUserAgent: M
      });
      function m(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          if (t) {
            o = o.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            });
          }
          n.push.apply(n, o);
        }
        return n;
      }
      function h(e) {
        h = (() => {
          if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            return function (e) {
              return typeof e;
            };
          } else {
            return function (e) {
              return (() => {
                if (e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype) {
                  return "symbol";
                } else {
                  return typeof e;
                }
              })();
            };
          }
        })();
        return h(e);
      }
      function z(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || false;
          o.configurable = true;
          if ("value" in o) {
            o.writable = true;
          }
          Object.defineProperty(e, o.key, o);
        }
      }
      function O(e, t, n) {
        (() => {
          if (t in e) {
            return Object.defineProperty(e, t, {
              value: n,
              enumerable: true,
              configurable: true,
              writable: true
            });
          } else {
            return e[t] = n;
          }
        })();
        return e;
      }
      function g() {
        g = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) {
              if (Object.prototype.hasOwnProperty.call(n, o)) {
                e[o] = n[o];
              }
            }
          }
          return e;
        };
        return g.apply(this, arguments);
      }
      function v(e) {
        v = (() => {
          if (Object.setPrototypeOf) {
            return Object.getPrototypeOf;
          } else {
            return function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            };
          }
        })();
        return v(e);
      }
      function y(e, t) {
        y = Object.setPrototypeOf || function (e, t) {
          e.__proto__ = t;
          return e;
        };
        return y(e, t);
      }
      function q(e, t) {
        if (e == null) {
          return {};
        }
        var n;
        var o;
        var a = function (e, t) {
          if (e == null) {
            return {};
          }
          var n;
          var o;
          var a = {};
          var r = Object.keys(e);
          for (o = 0; o < r.length; o++) {
            n = r[o];
            if (!(t.indexOf(n) >= 0)) {
              a[n] = e[n];
            }
          }
          return a;
        }(e, t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          for (o = 0; o < r.length; o++) {
            n = r[o];
            if (!(t.indexOf(n) >= 0)) {
              if (Object.prototype.propertyIsEnumerable.call(e, n)) {
                a[n] = e[n];
              }
            }
          }
        }
        return a;
      }
      function _(e) {
        if (e === undefined) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return e;
      }
      function x(e, t) {
        return function (e) {
          if (Array.isArray(e)) {
            return e;
          }
        }(e) || function (e, t) {
          var n = (() => {
            if (e == null) {
              return null;
            } else {
              return typeof Symbol !== "undefined" && e[Symbol.iterator] || e["@@iterator"];
            }
          })();
          if (n == null) {
            return;
          }
          var o;
          var a;
          var r = [];
          var i = true;
          var s = false;
          try {
            for (n = n.call(e); !(i = (o = n.next()).done) && (r.push(o.value), !t || r.length !== t); i = true);
          } catch (c) {
            s = true;
            a = c;
          } finally {
            try {
              if (!i && n.return != null) {
                n.return();
              }
            } finally {
              if (s) {
                throw a;
              }
            }
          }
          return r;
        }(e, t) || function (e, t) {
          if (!e) {
            return;
          }
          if (typeof e === "string") {
            return W(e, t);
          }
          var n = Object.prototype.toString.call(e).slice(8, -1);
          if (n === "Object" && e.constructor) {
            n = e.constructor.name;
          }
          if (n === "Map" || n === "Set") {
            return Array.from(e);
          }
          if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
            return W(e, t);
          }
        }(e, t) || function () {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function W(e, t) {
        if (t == null || t > e.length) {
          t = e.length;
        }
        for (var n = 0, o = new Array(t); n < t; n++) {
          o[n] = e[n];
        }
        return o;
      }
      var w = "mobile";
      var R = "tablet";
      var k = "smarttv";
      var L = "console";
      var S = "wearable";
      var N = "embedded";
      var C = undefined;
      var E = {
        Chrome: "Chrome",
        Firefox: "Firefox",
        Opera: "Opera",
        Yandex: "Yandex",
        Safari: "Safari",
        InternetExplorer: "Internet Explorer",
        Edge: "Edge",
        Chromium: "Chromium",
        Ie: "IE",
        MobileSafari: "Mobile Safari",
        EdgeChromium: "Edge Chromium",
        MIUI: "MIUI Browser",
        SamsungBrowser: "Samsung Browser"
      };
      var B = {
        IOS: "iOS",
        Android: "Android",
        WindowsPhone: "Windows Phone",
        Windows: "Windows",
        MAC_OS: "Mac OS"
      };
      var T = {
        isMobile: false,
        isTablet: false,
        isBrowser: false,
        isSmartTV: false,
        isConsole: false,
        isWearable: false
      };
      function j(e) {
        var t = (() => {
          if (arguments.length > 1 && arguments[1] !== undefined) {
            return arguments[1];
          } else {
            return "none";
          }
        })();
        return e || t;
      }
      function I() {
        return typeof window !== "undefined" && (!!window.navigator || !!navigator) && (window.navigator || navigator);
      }
      function D(e) {
        var t = I();
        return t && t.platform && (t.platform.indexOf(e) !== -1 || t.platform === "MacIntel" && t.maxTouchPoints > 1 && !window.MSStream);
      }
      function P(e, t, n, o) {
        return function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = (() => {
              if (arguments[t] != null) {
                return arguments[t];
              } else {
                return {};
              }
            })();
            (() => {
              if (t % 2) {
                return m(Object(n), true).forEach(function (t) {
                  O(e, t, n[t]);
                });
              } else {
                return (() => {
                  if (Object.getOwnPropertyDescriptors) {
                    return Object.defineProperties(e, Object.getOwnPropertyDescriptors(n));
                  } else {
                    return m(Object(n)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                    });
                  }
                })();
              }
            })();
          }
          return e;
        }({}, e, {
          vendor: j(t.vendor),
          model: j(t.model),
          os: j(n.name),
          osVersion: j(n.version),
          ua: j(o)
        });
      }
      function V(e) {
        return e.type === w;
      }
      function X(e) {
        return e.type === R;
      }
      function Y(e) {
        var t = e.type;
        return t === w || t === R;
      }
      function F(e) {
        return e.type === k;
      }
      function U(e) {
        return e.type === C;
      }
      function H(e) {
        return e.type === S;
      }
      function Q(e) {
        return e.type === L;
      }
      function K(e) {
        return e.type === N;
      }
      function J(e) {
        var t = e.vendor;
        return j(t);
      }
      function G(e) {
        var t = e.model;
        return j(t);
      }
      function Z(e) {
        var t = e.type;
        return j(t, "browser");
      }
      function $(e) {
        return e.name === B.Android;
      }
      function ee(e) {
        return e.name === B.Windows;
      }
      function te(e) {
        return e.name === B.MAC_OS;
      }
      function ne(e) {
        return e.name === B.WindowsPhone;
      }
      function oe(e) {
        return e.name === B.IOS;
      }
      function ae(e) {
        var t = e.version;
        return j(t);
      }
      function re(e) {
        var t = e.name;
        return j(t);
      }
      function ie(e) {
        return e.name === E.Chrome;
      }
      function se(e) {
        return e.name === E.Firefox;
      }
      function ce(e) {
        return e.name === E.Chromium;
      }
      function le(e) {
        return e.name === E.Edge;
      }
      function ue(e) {
        return e.name === E.Yandex;
      }
      function pe(e) {
        var t = e.name;
        return t === E.Safari || t === E.MobileSafari;
      }
      function de(e) {
        return e.name === E.MobileSafari;
      }
      function fe(e) {
        return e.name === E.Opera;
      }
      function be(e) {
        var t = e.name;
        return t === E.InternetExplorer || t === E.Ie;
      }
      function Me(e) {
        return e.name === E.MIUI;
      }
      function Ae(e) {
        return e.name === E.SamsungBrowser;
      }
      function me(e) {
        var t = e.version;
        return j(t);
      }
      function he(e) {
        var t = e.major;
        return j(t);
      }
      function ze(e) {
        var t = e.name;
        return j(t);
      }
      function Oe(e) {
        var t = e.name;
        return j(t);
      }
      function ge(e) {
        var t = e.version;
        return j(t);
      }
      function ve() {
        var e = I();
        var t = e && e.userAgent && e.userAgent.toLowerCase();
        return typeof t === "string" && /electron/.test(t);
      }
      function ye(e) {
        return typeof e === "string" && e.indexOf("Edg/") !== -1;
      }
      function qe() {
        var e = I();
        return e && (/iPad|iPhone|iPod/.test(e.platform) || e.platform === "MacIntel" && e.maxTouchPoints > 1) && !window.MSStream;
      }
      function _e() {
        return D("iPad");
      }
      function xe() {
        return D("iPhone");
      }
      function We() {
        return D("iPod");
      }
      function we(e) {
        return j(e);
      }
      function Re(e) {
        var t = e || A;
        var n = t.device;
        var o = t.browser;
        var a = t.os;
        var r = t.engine;
        var i = t.ua;
        return {
          isSmartTV: F(n),
          isConsole: Q(n),
          isWearable: H(n),
          isEmbedded: K(n),
          isMobileSafari: de(o) || _e(),
          isChromium: ce(o),
          isMobile: Y(n) || _e(),
          isMobileOnly: V(n),
          isTablet: X(n) || _e(),
          isBrowser: U(n),
          isDesktop: U(n),
          isAndroid: $(a),
          isWinPhone: ne(a),
          isIOS: oe(a) || _e(),
          isChrome: ie(o),
          isFirefox: se(o),
          isSafari: pe(o),
          isOpera: fe(o),
          isIE: be(o),
          osVersion: ae(a),
          osName: re(a),
          fullBrowserVersion: me(o),
          browserVersion: he(o),
          browserName: ze(o),
          mobileVendor: J(n),
          mobileModel: G(n),
          engineName: Oe(r),
          engineVersion: ge(r),
          getUA: we(i),
          isEdge: le(o) || ye(i),
          isYandex: ue(o),
          deviceType: Z(n),
          isIOS13: qe(),
          isIPad13: _e(),
          isIPhone13: xe(),
          isIPod13: We(),
          isElectron: ve(),
          isEdgeChromium: ye(i),
          isLegacyEdge: le(o) && !ye(i),
          isWindows: ee(a),
          isMacOs: te(a),
          isMIUI: Me(o),
          isSamsungBrowser: Ae(o)
        };
      }
      var ke = F(u);
      var Le = Q(u);
      var Se = H(u);
      var Ne = K(u);
      var Ce = de(c) || _e();
      var Ee = ce(c);
      var Be = Y(u) || _e();
      var Te = V(u);
      var je = X(u) || _e();
      var Ie = U(u);
      var De = U(u);
      var Pe = $(d);
      var Ve = ne(d);
      var Xe = oe(d) || _e();
      var Ye = ie(c);
      var Fe = se(c);
      var Ue = pe(c);
      var He = fe(c);
      var Qe = be(c);
      var Ke = ae(d);
      var Je = re(d);
      var Ge = me(c);
      var Ze = he(c);
      var $e = ze(c);
      var et = J(u);
      var tt = G(u);
      var nt = Oe(p);
      var ot = ge(p);
      var at = we(f);
      var rt = le(c) || ye(f);
      var it = ue(c);
      var st = Z(u);
      var ct = qe();
      var lt = _e();
      var ut = xe();
      var pt = We();
      var dt = ve();
      var ft = ye(f);
      var bt = le(c) && !ye(f);
      var Mt = ee(d);
      var At = te(d);
      var mt = Me(c);
      var ht = Ae(c);
      function zt(e) {
        var t = e || window.navigator.userAgent;
        return M(t);
      }
      t.Dt = Pe;
      t.gn = Xe;
      t.tq = Be;
      t.UA = Te;
    }