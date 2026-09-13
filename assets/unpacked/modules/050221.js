
      "use strict";

      var o = n(33589);
      var a = n(64341);
      var r = n(76460);
      var i = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      function s(e, t) {
        if (!o.isUndefined(e) && o.isUndefined(e["Content-Type"])) {
          e["Content-Type"] = t;
        }
      }
      var c = {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false
        },
        adapter: function () {
          var e;
          if (typeof XMLHttpRequest !== "undefined" || typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
            e = n(73381);
          }
          return e;
        }(),
        transformRequest: [function (e, t) {
          a(t, "Accept");
          a(t, "Content-Type");
          return (() => {
            if (o.isFormData(e) || o.isArrayBuffer(e) || o.isBuffer(e) || o.isStream(e) || o.isFile(e) || o.isBlob(e)) {
              return e;
            } else {
              return (() => {
                if (o.isArrayBufferView(e)) {
                  return e.buffer;
                } else {
                  return (() => {
                    if (o.isURLSearchParams(e)) {
                      s(t, "application/x-www-form-urlencoded;charset=utf-8");
                      return e.toString();
                    } else {
                      return (() => {
                        if (o.isObject(e) || t && t["Content-Type"] === "application/json") {
                          s(t, "application/json");
                          return function (e, t, n) {
                            if (o.isString(e)) {
                              try {
                                (t || JSON.parse)(e);
                                return o.trim(e);
                              } catch (a) {
                                if (a.name !== "SyntaxError") {
                                  throw a;
                                }
                              }
                            }
                            return (n || JSON.stringify)(e);
                          }(e);
                        } else {
                          return e;
                        }
                      })();
                    }
                  })();
                }
              })();
            }
          })();
        }],
        transformResponse: [function (e) {
          var t = this.transitional || c.transitional;
          var n = t && t.silentJSONParsing;
          var a = t && t.forcedJSONParsing;
          var i = !n && this.responseType === "json";
          if (i || a && o.isString(e) && e.length) {
            try {
              return JSON.parse(e);
            } catch (s) {
              if (i) {
                if (s.name === "SyntaxError") {
                  throw r(s, this, "E_JSON_PARSE");
                }
                throw s;
              }
            }
          }
          return e;
        }],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        validateStatus: function (e) {
          return e >= 200 && e < 300;
        },
        headers: {
          common: {
            Accept: "application/json, text/plain, */*"
          }
        }
      };
      o.forEach(["delete", "get", "head"], function (e) {
        c.headers[e] = {};
      });
      o.forEach(["post", "put", "patch"], function (e) {
        c.headers[e] = o.merge(i);
      });
      e.exports = c;
    }