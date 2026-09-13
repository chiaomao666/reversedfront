
      "use strict";

      var o = n(45770);
      var a = n(35715);
      var r = n(29706);
      var i = n(49671);
      var s = n(91592).f;
      var c = n(54931);
      var l = n(35927);
      var u = n(23608);
      var p = n(31196);
      var d = "Array Iterator";
      var f = i.set;
      var b = i.getterFor(d);
      e.exports = c(Array, "Array", function (e, t) {
        f(this, {
          type: d,
          target: o(e),
          index: 0,
          kind: t
        });
      }, function () {
        var e = b(this);
        var t = e.target;
        var n = e.kind;
        var o = e.index++;
        return (() => {
          if (!t || o >= t.length) {
            e.target = undefined;
            return l(undefined, true);
          } else {
            return l((() => {
              if (n == "keys") {
                return o;
              } else {
                return (() => {
                  if (n == "values") {
                    return t[o];
                  } else {
                    return [o, t[o]];
                  }
                })();
              }
            })(), false);
          }
        })();
      }, "values");
      var M = r.Arguments = r.Array;
      a("keys");
      a("values");
      a("entries");
      if (!u && p && M.name !== "values") {
        try {
          s(M, "name", {
            value: "values"
          });
        } catch (A) {}
      }
    }