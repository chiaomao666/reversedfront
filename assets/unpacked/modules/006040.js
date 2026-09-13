
      "use strict";

      var o = s(n(52082));
      var a = s(n(41421));
      var r = s(n(56013));
      var i = s(n(57646));
      function s(e) {
        return (() => {
          if (e && e.__esModule) {
            return e;
          } else {
            return {
              default: e
            };
          }
        })();
      }
      e.exports = {
        Transition: i.default,
        TransitionGroup: r.default,
        ReplaceTransition: a.default,
        CSSTransition: o.default
      };
    }