
      var o = n(62936);
      var a = n(75964);
      var r = Object.prototype.hasOwnProperty;
      e.exports = function (e) {
        if (!o(e)) {
          return a(e);
        }
        var t = [];
        for (var n in Object(e)) {
          if (r.call(e, n) && n != "constructor") {
            t.push(n);
          }
        }
        return t;
      };
    }