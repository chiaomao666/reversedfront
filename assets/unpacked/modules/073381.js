
      "use strict";

      var o = n(33589);
      var a = n(47297);
      var r = n(29301);
      var i = n(39774);
      var s = n(81804);
      var c = n(59145);
      var l = n(95411);
      var u = n(96467);
      var p = n(50221);
      var d = n(9346);
      e.exports = function (e) {
        return new Promise(function (t, n) {
          var f;
          var b = e.data;
          var M = e.headers;
          var A = e.responseType;
          function m() {
            if (e.cancelToken) {
              e.cancelToken.unsubscribe(f);
            }
            if (e.signal) {
              e.signal.removeEventListener("abort", f);
            }
          }
          if (o.isFormData(b)) {
            delete M["Content-Type"];
          }
          var h = new XMLHttpRequest();
          if (e.auth) {
            var z = e.auth.username || "";
            var O = (() => {
              if (e.auth.password) {
                return unescape(encodeURIComponent(e.auth.password));
              } else {
                return "";
              }
            })();
            M.Authorization = "Basic " + btoa(z + ":" + O);
          }
          var g = s(e.baseURL, e.url);
          function v() {
            if (h) {
              var o = (() => {
                if ("getAllResponseHeaders" in h) {
                  return c(h.getAllResponseHeaders());
                } else {
                  return null;
                }
              })();
              var r = {
                data: (() => {
                  if (A && A !== "text" && A !== "json") {
                    return h.response;
                  } else {
                    return h.responseText;
                  }
                })(),
                status: h.status,
                statusText: h.statusText,
                headers: o,
                config: e,
                request: h
              };
              a(function (e) {
                t(e);
                m();
              }, function (e) {
                n(e);
                m();
              }, r);
              h = null;
            }
          }
          h.open(e.method.toUpperCase(), i(g, e.params, e.paramsSerializer), true);
          h.timeout = e.timeout;
          (() => {
            if ("onloadend" in h) {
              return h.onloadend = v;
            } else {
              return h.onreadystatechange = function () {
                if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
                  setTimeout(v);
                }
              };
            }
          })();
          h.onabort = function () {
            if (h) {
              n(u("Request aborted", e, "ECONNABORTED", h));
              h = null;
            }
          };
          h.onerror = function () {
            n(u("Network Error", e, null, h));
            h = null;
          };
          h.ontimeout = function () {
            var t = (() => {
              if (e.timeout) {
                return "timeout of " + e.timeout + "ms exceeded";
              } else {
                return "timeout exceeded";
              }
            })();
            var o = e.transitional || p.transitional;
            if (e.timeoutErrorMessage) {
              t = e.timeoutErrorMessage;
            }
            n(u(t, e, (() => {
              if (o.clarifyTimeoutError) {
                return "ETIMEDOUT";
              } else {
                return "ECONNABORTED";
              }
            })(), h));
            h = null;
          };
          if (o.isStandardBrowserEnv()) {
            var y = (() => {
              if ((e.withCredentials || l(g)) && e.xsrfCookieName) {
                return r.read(e.xsrfCookieName);
              } else {
                return undefined;
              }
            })();
            if (y) {
              M[e.xsrfHeaderName] = y;
            }
          }
          if ("setRequestHeader" in h) {
            o.forEach(M, function (e, t) {
              (() => {
                if (typeof b === "undefined" && t.toLowerCase() === "content-type") {
                  return delete M[t];
                } else {
                  return h.setRequestHeader(t, e);
                }
              })();
            });
          }
          if (!o.isUndefined(e.withCredentials)) {
            h.withCredentials = !!e.withCredentials;
          }
          if (A && A !== "json") {
            h.responseType = e.responseType;
          }
          if (typeof e.onDownloadProgress === "function") {
            h.addEventListener("progress", e.onDownloadProgress);
          }
          if (typeof e.onUploadProgress === "function" && h.upload) {
            h.upload.addEventListener("progress", e.onUploadProgress);
          }
          if (e.cancelToken || e.signal) {
            f = function (e) {
              if (h) {
                n((() => {
                  if (!e || e && e.type) {
                    return new d("canceled");
                  } else {
                    return e;
                  }
                })());
                h.abort();
                h = null;
              }
            };
            if (e.cancelToken) {
              e.cancelToken.subscribe(f);
            }
            if (e.signal) {
              (() => {
                if (e.signal.aborted) {
                  return f();
                } else {
                  return e.signal.addEventListener("abort", f);
                }
              })();
            }
          }
          b ||= null;
          h.send(b);
        });
      };
    }