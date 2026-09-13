
      "use strict";

      var n = {}.propertyIsEnumerable;
      var o = Object.getOwnPropertyDescriptor;
      var a = o && !n.call({
        1: 2
      }, 1);
      t.f = (() => {
        if (a) {
          return function (e) {
            var t = o(this, e);
            return !!t && t.enumerable;
          };
        } else {
          return n;
        }
      })();
    }