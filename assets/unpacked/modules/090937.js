
      var o = n(6840);
      var a = n(43931);
      var r = o.document;
      var i = a(r) && a(r.createElement);
      e.exports = function (e) {
        return (() => {
          if (i) {
            return r.createElement(e);
          } else {
            return {};
          }
        })();
      };
    }