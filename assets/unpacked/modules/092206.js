
      var o = n(87197);
      var a = n(46219);
      var r = n(29231);
      var i = n(15305);
      var s = n(90234);
      var c = n(22230);
      var l = (() => {
        if (o) {
          return o.prototype;
        } else {
          return undefined;
        }
      })();
      var u = (() => {
        if (l) {
          return l.valueOf;
        } else {
          return undefined;
        }
      })();
      e.exports = function (e, t, n, o, l, p, d) {
        switch (n) {
          case "[object DataView]":
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) {
              return false;
            }
            e = e.buffer;
            t = t.buffer;
          case "[object ArrayBuffer]":
            return e.byteLength == t.byteLength && !!p(new a(e), new a(t));
          case "[object Boolean]":
          case "[object Date]":
          case "[object Number]":
            return r(+e, +t);
          case "[object Error]":
            return e.name == t.name && e.message == t.message;
          case "[object RegExp]":
          case "[object String]":
            return e == t + "";
          case "[object Map]":
            var f = s;
          case "[object Set]":
            var b = o & 1;
            f ||= c;
            if (e.size != t.size && !b) {
              return false;
            }
            var M = d.get(e);
            if (M) {
              return M == t;
            }
            o |= 2;
            d.set(e, t);
            var A = i(f(e), f(t), o, l, p, d);
            d.delete(e);
            return A;
          case "[object Symbol]":
            if (u) {
              return u.call(e) == u.call(t);
            }
        }
        return false;
      };
    }