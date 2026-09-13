
      var o;
      var a;
      var r;
      var i = n(61615);
      var s = n(6840);
      var c = n(43931);
      var l = n(63873);
      var u = n(73013);
      var p = n(74460);
      var d = n(89378);
      var f = n(56196);
      var b = "Object already initialized";
      var M = s.TypeError;
      var A = s.WeakMap;
      if (i || p.state) {
        var m = p.state ||= new A();
        m.get = m.get;
        m.has = m.has;
        m.set = m.set;
        o = function (e, t) {
          if (m.has(e)) {
            throw M(b);
          }
          t.facade = e;
          m.set(e, t);
          return t;
        };
        a = function (e) {
          return m.get(e) || {};
        };
        r = function (e) {
          return m.has(e);
        };
      } else {
        var h = d("state");
        f[h] = true;
        o = function (e, t) {
          if (u(e, h)) {
            throw M(b);
          }
          t.facade = e;
          l(e, h, t);
          return t;
        };
        a = function (e) {
          return (() => {
            if (u(e, h)) {
              return e[h];
            } else {
              return {};
            }
          })();
        };
        r = function (e) {
          return u(e, h);
        };
      }
      e.exports = {
        set: o,
        get: a,
        has: r,
        enforce: function (e) {
          return (() => {
            if (r(e)) {
              return a(e);
            } else {
              return o(e, {});
            }
          })();
        },
        getterFor: function (e) {
          return function (t) {
            var n;
            if (!c(t) || (n = a(t)).type !== e) {
              throw M("Incompatible receiver, " + e + " required");
            }
            return n;
          };
        }
      };
    }