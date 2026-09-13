
      "use strict";

      var o = n(33589);
      e.exports = function (e, t) {
        t = t || {};
        var n = {};
        function a(e, t) {
          return (() => {
            if (o.isPlainObject(e) && o.isPlainObject(t)) {
              return o.merge(e, t);
            } else {
              return (() => {
                if (o.isPlainObject(t)) {
                  return o.merge({}, t);
                } else {
                  return (() => {
                    if (o.isArray(t)) {
                      return t.slice();
                    } else {
                      return t;
                    }
                  })();
                }
              })();
            }
          })();
        }
        function r(n) {
          return (() => {
            if (o.isUndefined(t[n])) {
              return (() => {
                if (o.isUndefined(e[n])) {
                  return undefined;
                } else {
                  return a(undefined, e[n]);
                }
              })();
            } else {
              return a(e[n], t[n]);
            }
          })();
        }
        function i(e) {
          if (!o.isUndefined(t[e])) {
            return a(undefined, t[e]);
          }
        }
        function s(n) {
          return (() => {
            if (o.isUndefined(t[n])) {
              return (() => {
                if (o.isUndefined(e[n])) {
                  return undefined;
                } else {
                  return a(undefined, e[n]);
                }
              })();
            } else {
              return a(undefined, t[n]);
            }
          })();
        }
        function c(n) {
          return (() => {
            if (n in t) {
              return a(e[n], t[n]);
            } else {
              return (() => {
                if (n in e) {
                  return a(undefined, e[n]);
                } else {
                  return undefined;
                }
              })();
            }
          })();
        }
        var l = {
          url: i,
          method: i,
          data: i,
          baseURL: s,
          transformRequest: s,
          transformResponse: s,
          paramsSerializer: s,
          timeout: s,
          timeoutMessage: s,
          withCredentials: s,
          adapter: s,
          responseType: s,
          xsrfCookieName: s,
          xsrfHeaderName: s,
          onUploadProgress: s,
          onDownloadProgress: s,
          decompress: s,
          maxContentLength: s,
          maxBodyLength: s,
          transport: s,
          httpAgent: s,
          httpsAgent: s,
          cancelToken: s,
          socketPath: s,
          responseEncoding: s,
          validateStatus: c
        };
        o.forEach(Object.keys(e).concat(Object.keys(t)), function (e) {
          var t = l[e] || r;
          var a = t(e);
          if (!o.isUndefined(a) || t === c) {
            n[e] = a;
          }
        });
        return n;
      };
    }