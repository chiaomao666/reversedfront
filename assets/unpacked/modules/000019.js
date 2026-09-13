
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e == 0 || e % 100 > 1 && e % 100 < 11) {
                return 1;
              } else {
                return (() => {
                  if (e % 100 > 10 && e % 100 < 20) {
                    return 2;
                  } else {
                    return 3;
                  }
                })();
              }
            })();
          }
        })());
      }