
      var o = n(54138);
      var a = Function.prototype;
      var r = a.call;
      var i = o && a.bind.bind(r, r);
      e.exports = (() => {
        if (o) {
          return i;
        } else {
          return function (e) {
            return function () {
              return r.apply(e, arguments);
            };
          };
        }
      })();
    }