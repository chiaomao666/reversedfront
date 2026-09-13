
      var o = n(39218);
      var a = String;
      var r = TypeError;
      e.exports = function (e) {
        if (typeof e == "object" || o(e)) {
          return e;
        }
        throw r("Can't set " + a(e) + " as a prototype");
      };
    }