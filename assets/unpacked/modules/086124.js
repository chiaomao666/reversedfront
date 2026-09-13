
      var o = n(37205);
      var a = String;
      e.exports = function (e) {
        if (o(e) === "Symbol") {
          throw TypeError("Cannot convert a Symbol value to a string");
        }
        return a(e);
      };
    }