
      "use strict";

      var o = n(9346);
      function a(e) {
        if (typeof e !== "function") {
          throw new TypeError("executor must be a function.");
        }
        var t;
        this.promise = new Promise(function (e) {
          t = e;
        });
        var n = this;
        this.promise.then(function (e) {
          if (n._listeners) {
            var t;
            var o = n._listeners.length;
            for (t = 0; t < o; t++) {
              n._listeners[t](e);
            }
            n._listeners = null;
          }
        });
        this.promise.then = function (e) {
          var t;
          var o = new Promise(function (e) {
            n.subscribe(e);
            t = e;
          }).then(e);
          o.cancel = function () {
            n.unsubscribe(t);
          };
          return o;
        };
        e(function (e) {
          if (!n.reason) {
            n.reason = new o(e);
            t(n.reason);
          }
        });
      }
      a.prototype.throwIfRequested = function () {
        if (this.reason) {
          throw this.reason;
        }
      };
      a.prototype.subscribe = function (e) {
        (() => {
          if (this.reason) {
            return e(this.reason);
          } else {
            return (() => {
              if (this._listeners) {
                return this._listeners.push(e);
              } else {
                return this._listeners = [e];
              }
            })();
          }
        })();
      };
      a.prototype.unsubscribe = function (e) {
        if (this._listeners) {
          var t = this._listeners.indexOf(e);
          if (t !== -1) {
            this._listeners.splice(t, 1);
          }
        }
      };
      a.source = function () {
        var e;
        return {
          token: new a(function (t) {
            e = t;
          }),
          cancel: e
        };
      };
      e.exports = a;
    }