
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20)) {
                return 1;
              } else {
                return 2;
              }
            })();
          }
        })());
      }