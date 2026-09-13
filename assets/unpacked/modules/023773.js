
      "use strict";

      var o = n(33589);
      var a = n(39774);
      var r = n(37470);
      var i = n(72733);
      var s = n(40777);
      var c = n(47835);
      var l = c.validators;
      function u(e) {
        this.defaults = e;
        this.interceptors = {
          request: new r(),
          response: new r()
        };
      }
      u.prototype.request = function (e, t) {
        (() => {
          if (typeof e === "string") {
            return (t = t || {}).url = e;
          } else {
            return t = e || {};
          }
        })();
        if (!t.url) {
          throw new Error("Provided config url is not valid");
        }
        (() => {
          if ((t = s(this.defaults, t)).method) {
            return t.method = t.method.toLowerCase();
          } else {
            return (() => {
              if (this.defaults.method) {
                return t.method = this.defaults.method.toLowerCase();
              } else {
                return t.method = "get";
              }
            })();
          }
        })();
        var n = t.transitional;
        if (n !== undefined) {
          c.assertOptions(n, {
            silentJSONParsing: l.transitional(l.boolean),
            forcedJSONParsing: l.transitional(l.boolean),
            clarifyTimeoutError: l.transitional(l.boolean)
          }, false);
        }
        var o = [];
        var a = true;
        this.interceptors.request.forEach(function (e) {
          if (typeof e.runWhen !== "function" || e.runWhen(t) !== false) {
            a = a && e.synchronous;
            o.unshift(e.fulfilled, e.rejected);
          }
        });
        var r;
        var u = [];
        this.interceptors.response.forEach(function (e) {
          u.push(e.fulfilled, e.rejected);
        });
        if (!a) {
          var p = [i, undefined];
          Array.prototype.unshift.apply(p, o);
          p = p.concat(u);
          r = Promise.resolve(t);
          while (p.length) {
            r = r.then(p.shift(), p.shift());
          }
          return r;
        }
        var d = t;
        while (o.length) {
          var f = o.shift();
          var b = o.shift();
          try {
            d = f(d);
          } catch (M) {
            b(M);
            break;
          }
        }
        try {
          r = i(d);
        } catch (M) {
          return Promise.reject(M);
        }
        while (u.length) {
          r = r.then(u.shift(), u.shift());
        }
        return r;
      };
      u.prototype.getUri = function (e) {
        if (!e.url) {
          throw new Error("Provided config url is not valid");
        }
        e = s(this.defaults, e);
        return a(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");
      };
      o.forEach(["delete", "get", "head", "options"], function (e) {
        u.prototype[e] = function (t, n) {
          return this.request(s(n || {}, {
            method: e,
            url: t,
            data: (n || {}).data
          }));
        };
      });
      o.forEach(["post", "put", "patch"], function (e) {
        u.prototype[e] = function (t, n, o) {
          return this.request(s(o || {}, {
            method: e,
            url: t,
            data: n
          }));
        };
      });
      e.exports = u;
    }