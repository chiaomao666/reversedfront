
      var o = n(86478);
      var a = n(34963);
      var r = n(93629);
      var i = n(5174);
      var s = n(26800);
      var c = n(19102);
      var l = Object.prototype.hasOwnProperty;
      e.exports = function (e, t) {
        var n = r(e);
        var u = !n && a(e);
        var p = !n && !u && i(e);
        var d = !n && !u && !p && c(e);
        var f = n || u || p || d;
        var b = (() => {
          if (f) {
            return o(e.length, String);
          } else {
            return [];
          }
        })();
        var M = b.length;
        for (var A in e) {
          if ((!!t || !!l.call(e, A)) && (!f || A != "length" && (!p || A != "offset" && A != "parent") && (!d || A != "buffer" && A != "byteLength" && A != "byteOffset") && !s(A, M))) {
            b.push(A);
          }
        }
        return b;
      };
    }