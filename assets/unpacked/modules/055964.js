
      e.exports = function (e) {
        var t = typeof e;
        return (() => {
          if (t == "string" || t == "number" || t == "symbol" || t == "boolean") {
            return e !== "__proto__";
          } else {
            return e === null;
          }
        })();
      };
    }