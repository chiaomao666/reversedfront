
      var t = Function.prototype.toString;
      e.exports = function (e) {
        if (e != null) {
          try {
            return t.call(e);
          } catch (n) {}
          try {
            return e + "";
          } catch (n) {}
        }
        return "";
      };
    }