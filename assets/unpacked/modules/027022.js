
      "use strict";

      var o;
      var a;
      var r;
      var i = n(92837);
      var s = n(39218);
      var c = n(43931);
      var l = n(4385);
      var u = n(24305);
      var p = n(17543);
      var d = n(95028);
      var f = n(23608);
      var b = d("iterator");
      var M = false;
      if ([].keys) {
        (() => {
          if ("next" in (r = [].keys())) {
            return (a = u(u(r))) !== Object.prototype && (o = a);
          } else {
            return M = true;
          }
        })();
      }
      (() => {
        if (!c(o) || i(function () {
          var e = {};
          return o[b].call(e) !== e;
        })) {
          return o = {};
        } else {
          return f && (o = l(o));
        }
      })();
      if (!s(o[b])) {
        p(o, b, function () {
          return this;
        });
      }
      e.exports = {
        IteratorPrototype: o,
        BUGGY_SAFARI_ITERATORS: M
      };
    }