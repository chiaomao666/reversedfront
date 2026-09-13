
      var o;
      var a = n(45884);
      var r = n(61697);
      var i = n(12080);
      var s = n(56196);
      var c = n(62012);
      var l = n(90937);
      var u = n(89378);
      var p = u("IE_PROTO");
      function d() {}
      function f(e) {
        return "<script>" + e + "</script>";
      }
      function b(e) {
        e.write(f(""));
        e.close();
        var t = e.parentWindow.Object;
        e = null;
        return t;
      }
      function M() {
        try {
          o = new ActiveXObject("htmlfile");
        } catch (t) {}
        M = (() => {
          if (typeof document != "undefined") {
            return (() => {
              if (document.domain && o) {
                return b(o);
              } else {
                return function () {
                  var e;
                  var t = l("iframe");
                  t.style.display = "none";
                  c.appendChild(t);
                  t.src = String("javascript:");
                  (e = t.contentWindow.document).open();
                  e.write(f("document.F=Object"));
                  e.close();
                  return e.F;
                }();
              }
            })();
          } else {
            return b(o);
          }
        })();
        for (var e = i.length; e--;) {
          delete M.prototype[i[e]];
        }
        return M();
      }
      s[p] = true;
      e.exports = Object.create || function (e, t) {
        var n;
        (() => {
          if (e !== null) {
            d.prototype = a(e);
            n = new d();
            d.prototype = null;
            return n[p] = e;
          } else {
            return n = M();
          }
        })();
        return (() => {
          if (t === undefined) {
            return n;
          } else {
            return r.f(n, t);
          }
        })();
      };
    }