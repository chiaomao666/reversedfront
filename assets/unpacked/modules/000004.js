
        return Number((() => {
          if (e % 10 == 1 && e % 100 != 11) {
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