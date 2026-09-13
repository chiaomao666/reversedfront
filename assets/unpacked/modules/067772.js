
      var o = n(98513);
      var a = n(39218);
      var r = n(43931);
      var i = TypeError;
      e.exports = function (e, t) {
        var n;
        var s;
        if (t === "string" && a(n = e.toString) && !r(s = o(n, e))) {
          return s;
        }
        if (a(n = e.valueOf) && !r(s = o(n, e))) {
          return s;
        }
        if (t !== "string" && a(n = e.toString) && !r(s = o(n, e))) {
          return s;
        }
        throw i("Can't convert object to primitive value");
      };
    }