
      var o = n(39066);
      var a = n(8092);
      e.exports = function (e) {
        if (!a(e)) {
          return false;
        }
        var t = o(e);
        return t == "[object Function]" || t == "[object GeneratorFunction]" || t == "[object AsyncFunction]" || t == "[object Proxy]";
      };
    }