
      var o = n(4906);
      var a = n(43141);
      var r = Object.prototype;
      var i = r.hasOwnProperty;
      var s = r.propertyIsEnumerable;
      var c = (() => {
        if (o(function () {
          return arguments;
        }())) {
          return o;
        } else {
          return function (e) {
            return a(e) && i.call(e, "callee") && !s.call(e, "callee");
          };
        }
      })();
      e.exports = c;
    }