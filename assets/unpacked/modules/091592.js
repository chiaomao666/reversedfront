
      var o = n(31196);
      var a = n(36707);
      var r = n(26056);
      var i = n(45884);
      var s = n(54655);
      var c = TypeError;
      var l = Object.defineProperty;
      var u = Object.getOwnPropertyDescriptor;
      var p = "enumerable";
      var d = "configurable";
      var f = "writable";
      t.f = (() => {
        if (o) {
          return (() => {
            if (r) {
              return function (e, t, n) {
                i(e);
                t = s(t);
                i(n);
                if (typeof e === "function" && t === "prototype" && "value" in n && f in n && !n.writable) {
                  var o = u(e, t);
                  if (o && o.writable) {
                    e[t] = n.value;
                    n = {
                      configurable: (() => {
                        if (d in n) {
                          return n.configurable;
                        } else {
                          return o.configurable;
                        }
                      })(),
                      enumerable: (() => {
                        if (p in n) {
                          return n.enumerable;
                        } else {
                          return o.enumerable;
                        }
                      })(),
                      writable: false
                    };
                  }
                }
                return l(e, t, n);
              };
            } else {
              return l;
            }
          })();
        } else {
          return function (e, t, n) {
            i(e);
            t = s(t);
            i(n);
            if (a) {
              try {
                return l(e, t, n);
              } catch (o) {}
            }
            if ("get" in n || "set" in n) {
              throw c("Accessors not supported");
            }
            if ("value" in n) {
              e[t] = n.value;
            }
            return e;
          };
        }
      })();
    }