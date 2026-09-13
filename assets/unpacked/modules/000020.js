
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e == 0 || e % 100 > 0 && e % 100 < 20) {
                return 1;
              } else {
                return 2;
              }
            })();
          }
        })());
      }