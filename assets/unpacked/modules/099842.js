
      var o = n(29754);
      var a = n(57067);
      var r = n(78585);
      e.exports = function (e) {
        var t = a();
        return function () {
          var n;
          var a = o(e);
          if (t) {
            var i = o(this).constructor;
            n = Reflect.construct(a, arguments, i);
          } else {
            n = a.apply(this, arguments);
          }
          return r(this, n);
        };
      };
      e.exports.__esModule = true;
      e.exports.default = e.exports;
    }