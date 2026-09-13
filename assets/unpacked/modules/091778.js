
      var o = n(23608);
      var a = n(74460);
      (e.exports = function (e, t) {
        return a[e] ||= (() => {
          if (t !== undefined) {
            return t;
          } else {
            return {};
          }
        })();
      })("versions", []).push({
        version: "3.31.0",
        mode: (() => {
          if (o) {
            return "pure";
          } else {
            return "global";
          }
        })(),
        copyright: "© 2014-2023 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.31.0/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
    }