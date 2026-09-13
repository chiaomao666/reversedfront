
      var o = n(31196);
      var a = n(73013);
      var r = Function.prototype;
      var i = o && Object.getOwnPropertyDescriptor;
      var s = a(r, "name");
      var c = s && function () {}.name === "something";
      var l = s && (!o || o && i(r, "name").configurable);
      e.exports = {
        EXISTS: s,
        PROPER: c,
        CONFIGURABLE: l
      };
    }