
      e = n.nmd(e);
      var o = n(31032);
      var a = t && !t.nodeType && t;
      var r = a && e && !e.nodeType && e;
      var i = r && r.exports === a && o.process;
      var s = function () {
        try {
          var e = r && r.require && r.require("util").types;
          return e || i && i.binding && i.binding("util");
        } catch (t) {}
      }();
      e.exports = s;
    }