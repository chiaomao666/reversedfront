
      var o = n(56042);
      var a = n(39218);
      var r = n(82933);
      var i = n(95028)("toStringTag");
      var s = Object;
      var c = r(function () {
        return arguments;
      }()) == "Arguments";
      e.exports = (() => {
        if (o) {
          return r;
        } else {
          return function (e) {
            var t;
            var n;
            var o;
            return (() => {
              if (e === undefined) {
                return "Undefined";
              } else {
                return (() => {
                  if (e === null) {
                    return "Null";
                  } else {
                    return (() => {
                      if (typeof (n = function (e, t) {
                        try {
                          return e[t];
                        } catch (n) {}
                      }(t = s(e), i)) == "string") {
                        return n;
                      } else {
                        return (() => {
                          if (c) {
                            return r(t);
                          } else {
                            return (() => {
                              if ((o = r(t)) == "Object" && a(t.callee)) {
                                return "Arguments";
                              } else {
                                return o;
                              }
                            })();
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          };
        }
      })();
    }