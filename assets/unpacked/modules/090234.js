
      e.exports = function (e) {
        var t = -1;
        var n = Array(e.size);
        e.forEach(function (e, o) {
          n[++t] = [o, e];
        });
        return n;
      };
    }