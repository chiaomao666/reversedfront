
      var o = n(54138);
      var a = Function.prototype.call;
      e.exports = (() => {
        if (o) {
          return a.bind(a);
        } else {
          return function () {
            return a.apply(a, arguments);
          };
        }
      })();
    }