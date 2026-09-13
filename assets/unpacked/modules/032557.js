
      var o = n(74932);
      var a = n(92837);
      var r = n(39218);
      var i = n(73013);
      var s = n(31196);
      var c = n(23211).CONFIGURABLE;
      var l = n(88589);
      var u = n(49671);
      var p = u.enforce;
      var d = u.get;
      var f = String;
      var b = Object.defineProperty;
      var M = o("".slice);
      var A = o("".replace);
      var m = o([].join);
      var h = s && !a(function () {
        return b(function () {}, "length", {
          value: 8
        }).length !== 8;
      });
      var z = String(String).split("String");
      var O = e.exports = function (e, t, n) {
        if (M(f(t), 0, 7) === "Symbol(") {
          t = "[" + A(f(t), /^Symbol\(([^)]*)\)/, "$1") + "]";
        }
        if (n && n.getter) {
          t = "get " + t;
        }
        if (n && n.setter) {
          t = "set " + t;
        }
        if (!i(e, "name") || c && e.name !== t) {
          (() => {
            if (s) {
              return b(e, "name", {
                value: t,
                configurable: true
              });
            } else {
              return e.name = t;
            }
          })();
        }
        if (h && n && i(n, "arity") && e.length !== n.arity) {
          b(e, "length", {
            value: n.arity
          });
        }
        try {
          (() => {
            if (n && i(n, "constructor") && n.constructor) {
              return s && b(e, "prototype", {
                writable: false
              });
            } else {
              return e.prototype &&= undefined;
            }
          })();
        } catch (a) {}
        var o = p(e);
        if (!i(o, "source")) {
          o.source = m(z, (() => {
            if (typeof t == "string") {
              return t;
            } else {
              return "";
            }
          })());
        }
        return e;
      };
      Function.prototype.toString = O(function () {
        return r(this) && d(this).source || l(this);
      }, "toString");
    }