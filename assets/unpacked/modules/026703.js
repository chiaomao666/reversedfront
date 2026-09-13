
      var o = n(74786);
      var a = n(257);
      var r = n(8092);
      var i = n(27907);
      var s = /^\[object .+?Constructor\]$/;
      var c = Function.prototype;
      var l = Object.prototype;
      var u = c.toString;
      var p = l.hasOwnProperty;
      var d = RegExp("^" + u.call(p).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      e.exports = function (e) {
        return !!r(e) && !a(e) && (() => {
          if (o(e)) {
            return d;
          } else {
            return s;
          }
        })().test(i(e));
      };
    }