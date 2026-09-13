
      "use strict";

      var o = n(33589);
      function a() {
        this.handlers = [];
      }
      a.prototype.use = function (e, t, n) {
        this.handlers.push({
          fulfilled: e,
          rejected: t,
          synchronous: !!n && n.synchronous,
          runWhen: (() => {
            if (n) {
              return n.runWhen;
            } else {
              return null;
            }
          })()
        });
        return this.handlers.length - 1;
      };
      a.prototype.eject = function (e) {
        this.handlers[e] &&= null;
      };
      a.prototype.forEach = function (e) {
        o.forEach(this.handlers, function (t) {
          if (t !== null) {
            e(t);
          }
        });
      };
      e.exports = a;
    }