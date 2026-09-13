
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e == 2) {
                return 1;
              } else {
                return (() => {
                  if ((e < 0 || e > 10) && e % 10 == 0) {
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