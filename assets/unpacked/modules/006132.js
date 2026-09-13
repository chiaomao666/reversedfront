
      var o;
      o = n(72791);
      e.exports = function (e) {
        function t(o) {
          if (n[o]) {
            return n[o].exports;
          }
          var a = n[o] = {
            exports: {},
            id: o,
            loaded: false
          };
          e[o].call(a.exports, a, a.exports, t);
          a.loaded = true;
          return a.exports;
        }
        var n = {};
        t.m = e;
        t.c = n;
        t.p = "";
        return t(0);
      }([function (e, t, n) {
        e.exports = n(4);
      }, function (e, t, n) {
        e.exports = n(6)();
      }, function (e, t) {
        e.exports = o;
      }, function (e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: true
        });
        t.default = function (e, t) {
          return decodeURIComponent(e.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(t).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        };
      }, function (e, t, n) {
        "use strict";

        function o(e) {
          return (() => {
            if (e && e.__esModule) {
              return e;
            } else {
              return {
                default: e
              };
            }
          })();
        }
        function a(e, t) {
          if (!(e instanceof t)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function r(e, t) {
          if (!e) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }
          return (() => {
            if (!t || typeof t != "object" && typeof t != "function") {
              return e;
            } else {
              return t;
            }
          })();
        }
        function i(e, t) {
          if (typeof t != "function" && t !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof t);
          }
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          if (t) {
            (() => {
              if (Object.setPrototypeOf) {
                return Object.setPrototypeOf(e, t);
              } else {
                return e.__proto__ = t;
              }
            })();
          }
        }
        Object.defineProperty(t, "__esModule", {
          value: true
        });
        var s = Object.assign || function (e) {
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
        var c = function () {
          function e(e, t) {
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
          return function (t, n, o) {
            if (n) {
              e(t.prototype, n);
            }
            if (o) {
              e(t, o);
            }
            return t;
          };
        }();
        var l = o(n(2));
        var u = o(n(1));
        var p = o(n(5));
        var d = o(n(3));
        function f() {
          var e = false;
          try {
            e = !!window.navigator && !!window.navigator.standalone || !!navigator.userAgent.match("CriOS") || !!navigator.userAgent.match(/mobile/i);
          } catch (t) {}
          return e;
        }
        var b = function (e) {
          function t() {
            var e;
            var n;
            var o;
            a(this, t);
            for (var i = arguments.length, c = Array(i), l = 0; l < i; l++) {
              c[l] = arguments[l];
            }
            n = o = r(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(c)));
            o.state = {
              isSdkLoaded: false,
              isProcessing: false
            };
            o.responseApi = function (e) {
              window.FB.api("/me", {
                locale: o.props.language,
                fields: o.props.fields
              }, function (t) {
                s(t, e);
                o.props.callback(t);
              });
            };
            o.checkLoginState = function (e) {
              o.setStateIfMounted({
                isProcessing: false
              });
              (() => {
                if (e.authResponse) {
                  return o.responseApi(e.authResponse);
                } else {
                  return (() => {
                    if (o.props.onFailure) {
                      return o.props.onFailure({
                        status: e.status
                      });
                    } else {
                      return o.props.callback({
                        status: e.status
                      });
                    }
                  })();
                }
              })();
            };
            o.checkLoginAfterRefresh = function (e) {
              (() => {
                if (e.status === "connected") {
                  return o.checkLoginState(e);
                } else {
                  return window.FB.login(function (e) {
                    return o.checkLoginState(e);
                  }, true);
                }
              })();
            };
            o.click = function (e) {
              if (o.state.isSdkLoaded && !o.state.isProcessing && !o.props.isDisabled) {
                o.setState({
                  isProcessing: true
                });
                var t = o.props;
                var n = t.scope;
                var a = t.appId;
                var r = t.onClick;
                var i = t.returnScopes;
                var s = t.responseType;
                var c = t.redirectUri;
                var l = t.disableMobileRedirect;
                var u = t.authType;
                var d = t.state;
                if (typeof r != "function" || (r(e), !e.defaultPrevented)) {
                  var f = {
                    client_id: a,
                    redirect_uri: c,
                    state: d,
                    return_scopes: i,
                    scope: n,
                    response_type: s,
                    auth_type: u
                  };
                  if (o.props.isMobile && !l) {
                    window.location.href = "https://www.facebook.com/dialog/oauth" + (0, p.default)(f);
                  } else {
                    if (!window.FB) {
                      if (o.props.onFailure) {
                        o.props.onFailure({
                          status: "facebookNotLoaded"
                        });
                      }
                      return;
                    }
                    window.FB.login(o.checkLoginState, {
                      scope: n,
                      return_scopes: i,
                      auth_type: f.auth_type
                    });
                  }
                }
              }
            };
            return r(o, n);
          }
          i(t, e);
          c(t, [{
            key: "componentDidMount",
            value: function () {
              this._isMounted = true;
              if (document.getElementById("facebook-jssdk")) {
                this.sdkLoaded();
              } else {
                this.setFbAsyncInit();
                this.loadSdkAsynchronously();
                var e = document.getElementById("fb-root");
                if (!e) {
                  (e = document.createElement("div")).id = "fb-root";
                  document.body.appendChild(e);
                }
              }
            }
          }, {
            key: "componentWillReceiveProps",
            value: function (e) {
              if (this.state.isSdkLoaded && e.autoLoad && !this.props.autoLoad) {
                window.FB.getLoginStatus(this.checkLoginAfterRefresh);
              }
            }
          }, {
            key: "componentWillUnmount",
            value: function () {
              this._isMounted = false;
            }
          }, {
            key: "setStateIfMounted",
            value: function (e) {
              if (this._isMounted) {
                this.setState(e);
              }
            }
          }, {
            key: "setFbAsyncInit",
            value: function () {
              var e = this;
              var t = this.props;
              var n = t.appId;
              var o = t.xfbml;
              var a = t.cookie;
              var r = t.version;
              var i = t.autoLoad;
              window.fbAsyncInit = function () {
                window.FB.init({
                  version: "v" + r,
                  appId: n,
                  xfbml: o,
                  cookie: a
                });
                e.setStateIfMounted({
                  isSdkLoaded: true
                });
                if (i || e.isRedirectedFromFb()) {
                  window.FB.getLoginStatus(e.checkLoginAfterRefresh);
                }
              };
            }
          }, {
            key: "isRedirectedFromFb",
            value: function () {
              var e = window.location.search;
              return (0, d.default)(e, "code") || (0, d.default)(e, "granted_scopes");
            }
          }, {
            key: "sdkLoaded",
            value: function () {
              this.setState({
                isSdkLoaded: true
              });
            }
          }, {
            key: "loadSdkAsynchronously",
            value: function () {
              var e = this.props.language;
              (function (t, n, o) {
                var a = t.getElementsByTagName(n)[0];
                var r = a;
                var i = a;
                if (!t.getElementById(o)) {
                  (i = t.createElement(n)).id = o;
                  i.src = "https://connect.facebook.net/" + e + "/sdk.js";
                  r.parentNode.insertBefore(i, r);
                }
              })(document, "script", "facebook-jssdk");
            }
          }, {
            key: "render",
            value: function () {
              var e = this.props.render;
              if (!e) {
                throw new Error("ReactFacebookLogin requires a render prop to render");
              }
              var t = {
                onClick: this.click,
                isDisabled: !!this.props.isDisabled,
                isProcessing: this.state.isProcessing,
                isSdkLoaded: this.state.isSdkLoaded
              };
              return this.props.render(t);
            }
          }]);
          return t;
        }(l.default.Component);
        b.propTypes = {
          isDisabled: u.default.bool,
          callback: u.default.func.isRequired,
          appId: u.default.string.isRequired,
          xfbml: u.default.bool,
          cookie: u.default.bool,
          authType: u.default.string,
          scope: u.default.string,
          state: u.default.string,
          responseType: u.default.string,
          returnScopes: u.default.bool,
          redirectUri: u.default.string,
          autoLoad: u.default.bool,
          disableMobileRedirect: u.default.bool,
          isMobile: u.default.bool,
          fields: u.default.string,
          version: u.default.string,
          language: u.default.string,
          onClick: u.default.func,
          onFailure: u.default.func,
          render: u.default.func.isRequired
        };
        b.defaultProps = {
          redirectUri: (() => {
            if (typeof window != "undefined") {
              return window.location.href;
            } else {
              return "/";
            }
          })(),
          scope: "public_profile,email",
          returnScopes: false,
          xfbml: false,
          cookie: false,
          authType: "",
          fields: "name",
          version: "2.3",
          language: "en_US",
          disableMobileRedirect: false,
          isMobile: f(),
          onFailure: null,
          state: "facebookdirect",
          responseType: "code"
        };
        t.default = b;
      }, function (e, t) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: true
        });
        t.default = function (e) {
          return "?" + Object.keys(e).map(function (t) {
            return t + "=" + encodeURIComponent(e[t]);
          }).join("&");
        };
      }, function (e, t, n) {
        "use strict";

        function o() {}
        var a = n(7);
        e.exports = function () {
          function e(e, t, n, o, r, i) {
            if (i !== a) {
              var s = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
              s.name = "Invariant Violation";
              throw s;
            }
          }
          function t() {
            return e;
          }
          e.isRequired = e;
          var n = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t
          };
          n.checkPropTypes = o;
          n.PropTypes = n;
          return n;
        };
      }, function (e, t) {
        "use strict";

        var n = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
        e.exports = n;
      }]);
    }