
      "use strict";

      var o = n(33589);
      var a = n(52693);
      var r = n(35517);
      var i = n(50221);
      var s = n(9346);
      function c(e) {
        if (e.cancelToken) {
          e.cancelToken.throwIfRequested();
        }
        if (e.signal && e.signal.aborted) {
          throw new s("canceled");
        }
      }
      e.exports = function (e) {
        c(e);
        e.headers = e.headers || {};
        e.data = a.call(e, e.data, e.headers, e.transformRequest);
        e.headers = o.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers);
        o.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {
          delete e.headers[t];
        });
        return (e.adapter || i.adapter)(e).then(function (t) {
          c(e);
          t.data = a.call(e, t.data, t.headers, e.transformResponse);
          return t;
        }, function (t) {
          if (!r(t)) {
            c(e);
            if (t && t.response) {
              t.response.data = a.call(e, t.response.data, t.response.headers, e.transformResponse);
            }
          }
          return Promise.reject(t);
        });
      };
    }