
      e = n.nmd(e);
      var o = n(97009);
      var a = n(49488);
      var r = t && !t.nodeType && t;
      var i = r && e && !e.nodeType && e;
      var s = (() => {
        if (i && i.exports === r) {
          return o.Buffer;
        } else {
          return undefined;
        }
      })();
      var c = (() => {
        if (s) {
          return s.isBuffer;
        } else {
          return undefined;
        }
      })() || a;
      e.exports = c;
    }