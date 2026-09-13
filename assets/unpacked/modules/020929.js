
      if (typeof self != "undefined") {
        self;
      }
      e.exports = function (e) {
        o = {};
        t.m = n = [function (t) {
          t.exports = e;
        }, function (e, t, n) {
          e.exports = n(2)();
        }, function (e, t, n) {
          "use strict";

          function o() {}
          function a() {}
          var r = n(3);
          a.resetWarningCache = o;
          e.exports = function () {
            function e(e, t, n, o, a, i) {
              if (i !== r) {
                var s = Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                s.name = "Invariant Violation";
                throw s;
              }
            }
            function t() {
              return e;
            }
            var n = {
              array: e.isRequired = e,
              bool: e,
              func: e,
              number: e,
              object: e,
              string: e,
              symbol: e,
              any: e,
              arrayOf: t,
              element: e,
              elementType: e,
              instanceOf: t,
              node: e,
              objectOf: t,
              oneOf: t,
              oneOfType: t,
              shape: t,
              exact: t,
              checkPropTypes: a,
              resetWarningCache: o
            };
            return n.PropTypes = n;
          };
        }, function (e) {
          "use strict";

          e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
        }, function (e, t, n) {
          "use strict";

          function o(e, t) {
            return function (e) {
              if (Array.isArray(e)) {
                return e;
              }
            }(e) || function (e, t) {
              if (typeof Symbol != "undefined" && Symbol.iterator in Object(e)) {
                var n = [];
                var o = true;
                var a = false;
                var r = undefined;
                try {
                  for (var i, s = e[Symbol.iterator](); !(o = (i = s.next()).done) && (n.push(i.value), !t || n.length !== t); o = true);
                } catch (e) {
                  a = true;
                  r = e;
                } finally {
                  try {
                    if (!o && s.return != null) {
                      s.return();
                    }
                  } finally {
                    if (a) {
                      throw r;
                    }
                  }
                }
                return n;
              }
            }(e, t) || function (e, t) {
              if (e) {
                if (typeof e == "string") {
                  return a(e, t);
                }
                var n = Object.prototype.toString.call(e).slice(8, -1);
                if (n === "Object" && e.constructor) {
                  n = e.constructor.name;
                }
                return (() => {
                  if (n === "Map" || n === "Set") {
                    return Array.from(n);
                  } else {
                    return (() => {
                      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
                        return a(e, t);
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            }(e, t) || function () {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function a(e, t) {
            if (t == null || !(t <= e.length)) {
              t = e.length;
            }
            for (var n = 0, o = Array(t); n < t; n++) {
              o[n] = e[n];
            }
            return o;
          }
          function r(e, t) {
            return function (e) {
              if (Array.isArray(e)) {
                return e;
              }
            }(e) || function (e, t) {
              if (typeof Symbol != "undefined" && Symbol.iterator in Object(e)) {
                var n = [];
                var o = true;
                var a = false;
                var r = undefined;
                try {
                  for (var i, s = e[Symbol.iterator](); !(o = (i = s.next()).done) && (n.push(i.value), !t || n.length !== t); o = true);
                } catch (e) {
                  a = true;
                  r = e;
                } finally {
                  try {
                    if (!o && s.return != null) {
                      s.return();
                    }
                  } finally {
                    if (a) {
                      throw r;
                    }
                  }
                }
                return n;
              }
            }(e, t) || function (e, t) {
              if (e) {
                if (typeof e == "string") {
                  return i(e, t);
                }
                var n = Object.prototype.toString.call(e).slice(8, -1);
                if (n === "Object" && e.constructor) {
                  n = e.constructor.name;
                }
                return (() => {
                  if (n === "Map" || n === "Set") {
                    return Array.from(n);
                  } else {
                    return (() => {
                      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
                        return i(e, t);
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            }(e, t) || function () {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function i(e, t) {
            if (t == null || !(t <= e.length)) {
              t = e.length;
            }
            for (var n = 0, o = Array(t); n < t; n++) {
              o[n] = e[n];
            }
            return o;
          }
          function s(e, t) {
            return function (e) {
              if (Array.isArray(e)) {
                return e;
              }
            }(e) || function (e, t) {
              if (typeof Symbol != "undefined" && Symbol.iterator in Object(e)) {
                var n = [];
                var o = true;
                var a = false;
                var r = undefined;
                try {
                  for (var i, s = e[Symbol.iterator](); !(o = (i = s.next()).done) && (n.push(i.value), !t || n.length !== t); o = true);
                } catch (e) {
                  a = true;
                  r = e;
                } finally {
                  try {
                    if (!o && s.return != null) {
                      s.return();
                    }
                  } finally {
                    if (a) {
                      throw r;
                    }
                  }
                }
                return n;
              }
            }(e, t) || function (e, t) {
              if (e) {
                if (typeof e == "string") {
                  return c(e, t);
                }
                var n = Object.prototype.toString.call(e).slice(8, -1);
                if (n === "Object" && e.constructor) {
                  n = e.constructor.name;
                }
                return (() => {
                  if (n === "Map" || n === "Set") {
                    return Array.from(n);
                  } else {
                    return (() => {
                      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
                        return c(e, t);
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            }(e, t) || function () {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function c(e, t) {
            if (t == null || !(t <= e.length)) {
              t = e.length;
            }
            for (var n = 0, o = Array(t); n < t; n++) {
              o[n] = e[n];
            }
            return o;
          }
          function l(e, t) {
            return function (e) {
              if (Array.isArray(e)) {
                return e;
              }
            }(e) || function (e, t) {
              if (typeof Symbol != "undefined" && Symbol.iterator in Object(e)) {
                var n = [];
                var o = true;
                var a = false;
                var r = undefined;
                try {
                  for (var i, s = e[Symbol.iterator](); !(o = (i = s.next()).done) && (n.push(i.value), !t || n.length !== t); o = true);
                } catch (e) {
                  a = true;
                  r = e;
                } finally {
                  try {
                    if (!o && s.return != null) {
                      s.return();
                    }
                  } finally {
                    if (a) {
                      throw r;
                    }
                  }
                }
                return n;
              }
            }(e, t) || function (e, t) {
              if (e) {
                if (typeof e == "string") {
                  return u(e, t);
                }
                var n = Object.prototype.toString.call(e).slice(8, -1);
                if (n === "Object" && e.constructor) {
                  n = e.constructor.name;
                }
                return (() => {
                  if (n === "Map" || n === "Set") {
                    return Array.from(n);
                  } else {
                    return (() => {
                      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
                        return u(e, t);
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            }(e, t) || function () {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
          }
          function u(e, t) {
            if (t == null || !(t <= e.length)) {
              t = e.length;
            }
            for (var n = 0, o = Array(t); n < t; n++) {
              o[n] = e[n];
            }
            return o;
          }
          function p(e, t, n, o, a, r) {
            var i = e.getElementsByTagName(t)[0];
            var s = i;
            var c = i;
            (c = e.createElement(t)).id = n;
            c.src = o;
            (() => {
              if (s && s.parentNode) {
                return s.parentNode.insertBefore(c, s);
              } else {
                return e.head.appendChild(c);
              }
            })();
            c.onerror = r;
            c.onload = a;
          }
          function d(e, t) {
            var n = e.getElementById(t);
            if (n) {
              n.parentNode.removeChild(n);
            }
          }
          function f(e) {
            return m.a.createElement("span", {
              style: {
                paddingRight: 10,
                fontWeight: 500,
                paddingLeft: (() => {
                  if (e.icon) {
                    return 0;
                  } else {
                    return 10;
                  }
                })(),
                paddingTop: 10,
                paddingBottom: 10
              }
            }, e.children);
          }
          function b(e) {
            return m.a.createElement("div", {
              style: {
                marginRight: 10,
                background: (() => {
                  if (e.active) {
                    return "#eee";
                  } else {
                    return "#fff";
                  }
                })(),
                padding: 10,
                borderRadius: 2
              }
            }, m.a.createElement("svg", {
              width: "18",
              height: "18",
              xmlns: "http://www.w3.org/2000/svg"
            }, m.a.createElement("g", {
              fill: "#000",
              fillRule: "evenodd"
            }, m.a.createElement("path", {
              d: "M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z",
              fill: "#EA4335"
            }), m.a.createElement("path", {
              d: "M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z",
              fill: "#4285F4"
            }), m.a.createElement("path", {
              d: "M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z",
              fill: "#FBBC05"
            }), m.a.createElement("path", {
              d: "M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z",
              fill: "#34A853"
            }), m.a.createElement("path", {
              fill: "none",
              d: "M0 0h18v18H0z"
            }))));
          }
          function M(e) {
            var t = r(Object(A.useState)(false), 2);
            var n = t[0];
            var o = t[1];
            var a = r(Object(A.useState)(false), 2);
            var i = a[0];
            var s = a[1];
            var c = e.tag;
            var l = e.type;
            var u = e.className;
            var p = e.disabledStyle;
            var d = e.buttonText;
            var M = e.children;
            var z = e.render;
            var O = e.theme;
            var g = e.icon;
            var v = e.disabled;
            var y = h({
              onSuccess: e.onSuccess,
              onAutoLoadFinished: e.onAutoLoadFinished,
              onRequest: e.onRequest,
              onFailure: e.onFailure,
              onScriptLoadFailure: e.onScriptLoadFailure,
              clientId: e.clientId,
              cookiePolicy: e.cookiePolicy,
              loginHint: e.loginHint,
              hostedDomain: e.hostedDomain,
              autoLoad: e.autoLoad,
              isSignedIn: e.isSignedIn,
              fetchBasicProfile: e.fetchBasicProfile,
              redirectUri: e.redirectUri,
              discoveryDocs: e.discoveryDocs,
              uxMode: e.uxMode,
              scope: e.scope,
              accessType: e.accessType,
              responseType: e.responseType,
              jsSrc: e.jsSrc,
              prompt: e.prompt
            });
            var q = y.signIn;
            var _ = v || !y.loaded;
            if (z) {
              return z({
                onClick: q,
                disabled: _
              });
            }
            var x = {
              backgroundColor: (() => {
                if (O === "dark") {
                  return "rgb(66, 133, 244)";
                } else {
                  return "#fff";
                }
              })(),
              display: "inline-flex",
              alignItems: "center",
              color: (() => {
                if (O === "dark") {
                  return "#fff";
                } else {
                  return "rgba(0, 0, 0, .54)";
                }
              })(),
              boxShadow: "0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)",
              padding: 0,
              borderRadius: 2,
              border: "1px solid transparent",
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Roboto, sans-serif"
            };
            var W = {
              cursor: "pointer",
              backgroundColor: (() => {
                if (O === "dark") {
                  return "#3367D6";
                } else {
                  return "#eee";
                }
              })(),
              color: (() => {
                if (O === "dark") {
                  return "#fff";
                } else {
                  return "rgba(0, 0, 0, .54)";
                }
              })(),
              opacity: 1
            };
            var w = (() => {
              if (_) {
                return Object.assign({}, x, p);
              } else {
                return (() => {
                  if (i) {
                    return Object.assign({}, x, W);
                  } else {
                    return (() => {
                      if (n) {
                        return Object.assign({}, x, {
                          cursor: "pointer",
                          opacity: 0.9
                        });
                      } else {
                        return x;
                      }
                    })();
                  }
                })();
              }
            })();
            return m.a.createElement(c, {
              onMouseEnter: function () {
                return o(true);
              },
              onMouseLeave: function () {
                o(false);
                s(false);
              },
              onMouseDown: function () {
                return s(true);
              },
              onMouseUp: function () {
                return s(false);
              },
              onClick: q,
              style: w,
              type: l,
              disabled: _,
              className: u
            }, [g && m.a.createElement(b, {
              key: 1,
              active: i
            }), m.a.createElement(f, {
              icon: g,
              key: 2
            }, M || d)]);
          }
          n.r(t);
          n.d(t, "default", function () {
            return O;
          });
          n.d(t, "GoogleLogin", function () {
            return O;
          });
          n.d(t, "GoogleLogout", function () {
            return v;
          });
          n.d(t, "useGoogleLogin", function () {
            return h;
          });
          n.d(t, "useGoogleLogout", function () {
            return g;
          });
          var A = n(0);
          var m = n.n(A);
          n(1);
          function h(e) {
            function t(e) {
              var t = e.getBasicProfile();
              var n = e.getAuthResponse(true);
              e.googleId = t.getId();
              e.tokenObj = n;
              e.tokenId = n.id_token;
              e.accessToken = n.access_token;
              e.profileObj = {
                googleId: t.getId(),
                imageUrl: t.getImageUrl(),
                email: t.getEmail(),
                name: t.getName(),
                givenName: t.getGivenName(),
                familyName: t.getFamilyName()
              };
              r(e);
            }
            function n(e) {
              if (e) {
                e.preventDefault();
              }
              if (N) {
                var n = window.gapi.auth2.getAuthInstance();
                var o = {
                  prompt: L
                };
                f();
                (() => {
                  if (w === "code") {
                    return n.grantOfflineAccess(o).then(function (e) {
                      return r(e);
                    }, function (e) {
                      return l(e);
                    });
                  } else {
                    return n.signIn(o).then(function (e) {
                      return t(e);
                    }, function (e) {
                      return l(e);
                    });
                  }
                })();
              }
            }
            var a = e.onSuccess;
            var r = (() => {
              if (a === undefined) {
                return function () {};
              } else {
                return a;
              }
            })();
            var i = e.onAutoLoadFinished;
            var s = (() => {
              if (i === undefined) {
                return function () {};
              } else {
                return i;
              }
            })();
            var c = e.onFailure;
            var l = (() => {
              if (c === undefined) {
                return function () {};
              } else {
                return c;
              }
            })();
            var u = e.onRequest;
            var f = (() => {
              if (u === undefined) {
                return function () {};
              } else {
                return u;
              }
            })();
            var b = e.onScriptLoadFailure;
            var M = e.clientId;
            var m = e.cookiePolicy;
            var h = e.loginHint;
            var z = e.hostedDomain;
            var O = e.autoLoad;
            var g = e.isSignedIn;
            var v = e.fetchBasicProfile;
            var y = e.redirectUri;
            var q = e.discoveryDocs;
            var _ = e.uxMode;
            var x = e.scope;
            var W = e.accessType;
            var w = e.responseType;
            var R = e.jsSrc;
            var k = (() => {
              if (R === undefined) {
                return "https://apis.google.com/js/api.js";
              } else {
                return R;
              }
            })();
            var L = e.prompt;
            var S = o(Object(A.useState)(false), 2);
            var N = S[0];
            var C = S[1];
            Object(A.useEffect)(function () {
              var e = false;
              var n = b || l;
              p(document, "script", "google-login", k, function () {
                var o = {
                  client_id: M,
                  cookie_policy: m,
                  login_hint: h,
                  hosted_domain: z,
                  fetch_basic_profile: v,
                  discoveryDocs: q,
                  ux_mode: _,
                  redirect_uri: y,
                  scope: x,
                  access_type: W
                };
                if (w === "code") {
                  o.access_type = "offline";
                }
                window.gapi.load("auth2", function () {
                  var a = window.gapi.auth2.getAuthInstance();
                  (() => {
                    if (a) {
                      return a.then(function () {
                        if (!e) {
                          (() => {
                            if (g && a.isSignedIn.get()) {
                              C(true);
                              s(true);
                              return t(a.currentUser.get());
                            } else {
                              C(true);
                              return s(false);
                            }
                          })();
                        }
                      }, function (e) {
                        l(e);
                      });
                    } else {
                      return window.gapi.auth2.init(o).then(function (n) {
                        if (!e) {
                          C(true);
                          var o = g && n.isSignedIn.get();
                          s(o);
                          if (o) {
                            t(n.currentUser.get());
                          }
                        }
                      }, function (e) {
                        C(true);
                        s(false);
                        n(e);
                      });
                    }
                  })();
                });
              }, function (e) {
                n(e);
              });
              return function () {
                e = true;
                d(document, "google-login");
              };
            }, []);
            Object(A.useEffect)(function () {
              if (O) {
                n();
              }
            }, [N]);
            return {
              signIn: n,
              loaded: N
            };
          }
          function z(e) {
            var t = l(Object(A.useState)(false), 2);
            var n = t[0];
            var o = t[1];
            var a = l(Object(A.useState)(false), 2);
            var r = a[0];
            var i = a[1];
            var s = e.tag;
            var c = e.type;
            var u = e.className;
            var p = e.disabledStyle;
            var d = e.buttonText;
            var M = e.children;
            var h = e.render;
            var z = e.theme;
            var O = e.icon;
            var v = e.disabled;
            var y = g({
              jsSrc: e.jsSrc,
              onFailure: e.onFailure,
              onScriptLoadFailure: e.onScriptLoadFailure,
              clientId: e.clientId,
              cookiePolicy: e.cookiePolicy,
              loginHint: e.loginHint,
              hostedDomain: e.hostedDomain,
              fetchBasicProfile: e.fetchBasicProfile,
              discoveryDocs: e.discoveryDocs,
              uxMode: e.uxMode,
              redirectUri: e.redirectUri,
              scope: e.scope,
              accessType: e.accessType,
              onLogoutSuccess: e.onLogoutSuccess
            });
            var q = y.signOut;
            var _ = v || !y.loaded;
            if (h) {
              return h({
                onClick: q,
                disabled: _
              });
            }
            var x = {
              backgroundColor: (() => {
                if (z === "dark") {
                  return "rgb(66, 133, 244)";
                } else {
                  return "#fff";
                }
              })(),
              display: "inline-flex",
              alignItems: "center",
              color: (() => {
                if (z === "dark") {
                  return "#fff";
                } else {
                  return "rgba(0, 0, 0, .54)";
                }
              })(),
              boxShadow: "0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)",
              padding: 0,
              borderRadius: 2,
              border: "1px solid transparent",
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Roboto, sans-serif"
            };
            var W = {
              cursor: "pointer",
              backgroundColor: (() => {
                if (z === "dark") {
                  return "#3367D6";
                } else {
                  return "#eee";
                }
              })(),
              color: (() => {
                if (z === "dark") {
                  return "#fff";
                } else {
                  return "rgba(0, 0, 0, .54)";
                }
              })(),
              opacity: 1
            };
            var w = (() => {
              if (_) {
                return Object.assign({}, x, p);
              } else {
                return (() => {
                  if (r) {
                    return Object.assign({}, x, W);
                  } else {
                    return (() => {
                      if (n) {
                        return Object.assign({}, x, {
                          cursor: "pointer",
                          opacity: 0.9
                        });
                      } else {
                        return x;
                      }
                    })();
                  }
                })();
              }
            })();
            return m.a.createElement(s, {
              onMouseEnter: function () {
                return o(true);
              },
              onMouseLeave: function () {
                o(false);
                i(false);
              },
              onMouseDown: function () {
                return i(true);
              },
              onMouseUp: function () {
                return i(false);
              },
              onClick: q,
              style: w,
              type: c,
              disabled: _,
              className: u
            }, [O && m.a.createElement(b, {
              key: 1,
              active: r
            }), m.a.createElement(f, {
              icon: O,
              key: 2
            }, M || d)]);
          }
          M.defaultProps = {
            type: "button",
            tag: "button",
            buttonText: "Sign in with Google",
            scope: "profile email",
            accessType: "online",
            prompt: "",
            cookiePolicy: "single_host_origin",
            fetchBasicProfile: true,
            isSignedIn: false,
            uxMode: "popup",
            disabledStyle: {
              opacity: 0.6
            },
            icon: true,
            theme: "light",
            onRequest: function () {}
          };
          var O = M;
          function g(e) {
            var t = e.jsSrc;
            var n = (() => {
              if (t === undefined) {
                return "https://apis.google.com/js/api.js";
              } else {
                return t;
              }
            })();
            var o = e.onFailure;
            var a = e.onScriptLoadFailure;
            var r = e.clientId;
            var i = e.cookiePolicy;
            var c = e.loginHint;
            var l = e.hostedDomain;
            var u = e.fetchBasicProfile;
            var f = e.discoveryDocs;
            var b = e.uxMode;
            var M = e.redirectUri;
            var m = e.scope;
            var h = e.accessType;
            var z = e.onLogoutSuccess;
            var O = s(Object(A.useState)(false), 2);
            var g = O[0];
            var v = O[1];
            var y = Object(A.useCallback)(function () {
              if (window.gapi) {
                var e = window.gapi.auth2.getAuthInstance();
                if (e != null) {
                  e.then(function () {
                    e.signOut().then(function () {
                      e.disconnect();
                      z();
                    });
                  }, function (e) {
                    return o(e);
                  });
                }
              }
            }, [z]);
            Object(A.useEffect)(function () {
              var e = a || o;
              p(document, "script", "google-login", n, function () {
                var t = {
                  client_id: r,
                  cookie_policy: i,
                  login_hint: c,
                  hosted_domain: l,
                  fetch_basic_profile: u,
                  discoveryDocs: f,
                  ux_mode: b,
                  redirect_uri: M,
                  scope: m,
                  access_type: h
                };
                window.gapi.load("auth2", function () {
                  (() => {
                    if (window.gapi.auth2.getAuthInstance()) {
                      return v(true);
                    } else {
                      return window.gapi.auth2.init(t).then(function () {
                        return v(true);
                      }, function (t) {
                        return e(t);
                      });
                    }
                  })();
                });
              }, function (t) {
                e(t);
              });
              return function () {
                d(document, "google-login");
              };
            }, []);
            return {
              signOut: y,
              loaded: g
            };
          }
          z.defaultProps = {
            type: "button",
            tag: "button",
            buttonText: "Logout of Google",
            disabledStyle: {
              opacity: 0.6
            },
            icon: true,
            theme: "light",
            jsSrc: "https://apis.google.com/js/api.js"
          };
          var v = z;
        }];
        t.c = o;
        t.d = function (e, n, o) {
          if (!t.o(e, n)) {
            Object.defineProperty(e, n, {
              enumerable: true,
              get: o
            });
          }
        };
        t.r = function (e) {
          if (typeof Symbol != "undefined" && Symbol.toStringTag) {
            Object.defineProperty(e, Symbol.toStringTag, {
              value: "Module"
            });
          }
          Object.defineProperty(e, "__esModule", {
            value: true
          });
        };
        t.t = function (e, n) {
          if (n & 1) {
            e = t(e);
          }
          if (n & 8) {
            return e;
          }
          if (n & 4 && typeof e == "object" && e && e.__esModule) {
            return e;
          }
          var o = Object.create(null);
          t.r(o);
          Object.defineProperty(o, "default", {
            enumerable: true,
            value: e
          });
          if (n & 2 && typeof e != "string") {
            for (var a in e) {
              t.d(o, a, function (t) {
                return e[t];
              }.bind(null, a));
            }
          }
          return o;
        };
        t.n = function (e) {
          var n = (() => {
            if (e && e.__esModule) {
              return function () {
                return e.default;
              };
            } else {
              return function () {
                return e;
              };
            }
          })();
          t.d(n, "a", n);
          return n;
        };
        t.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        };
        t.p = "";
        return t(t.s = 4);
        function t(e) {
          if (o[e]) {
            return o[e].exports;
          }
          var a = o[e] = {
            i: e,
            l: false,
            exports: {}
          };
          n[e].call(a.exports, a, a.exports, t);
          a.l = true;
          return a.exports;
        }
        var n;
        var o;
      }(n(72791));
    }