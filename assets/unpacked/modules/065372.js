
      var o;
      var a;
      var r = n(6840);
      var i = n(84839);
      var s = r.process;
      var c = r.Deno;
      var l = s && s.versions || c && c.version;
      var u = l && l.v8;
      if (u) {
        a = (() => {
          if ((o = u.split("."))[0] > 0 && o[0] < 4) {
            return 1;
          } else {
            return +(o[0] + o[1]);
          }
        })();
      }
      if (!a && i && (!(o = i.match(/Edge\/(\d+)/)) || o[1] >= 74) && (o = i.match(/Chrome\/(\d+)/))) {
        a = +o[1];
      }
      e.exports = a;
    }