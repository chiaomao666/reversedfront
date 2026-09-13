
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e >= 2 && e <= 4) {
                return 1;
              } else {
                return 2;
              }
            })();
          }
        })());
      }