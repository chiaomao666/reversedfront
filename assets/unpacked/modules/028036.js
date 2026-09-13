
      "use strict";

      var o = n(33589);
      var a = n(44049);
      var r = n(23773);
      var i = n(40777);
      var s = function e(t) {
        var n = new r(t);
        var s = a(r.prototype.request, n);
        o.extend(s, r.prototype, n);
        o.extend(s, n);
        s.create = function (n) {
          return e(i(t, n));
        };
        return s;
      }(n(50221));
      s.Axios = r;
      s.Cancel = n(9346);
      s.CancelToken = n(6857);
      s.isCancel = n(35517);
      s.VERSION = n(67600).version;
      s.all = function (e) {
        return Promise.all(e);
      };
      s.spread = n(98089);
      s.isAxiosError = n(49580);
      e.exports = s;
      e.exports.default = s;
    }