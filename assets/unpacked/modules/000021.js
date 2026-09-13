
        return Number((() => {
          if (e % 100 == 1) {
            return 1;
          } else {
            return (() => {
              if (e % 100 == 2) {
                return 2;
              } else {
                return (() => {
                  if (e % 100 == 3 || e % 100 == 4) {
                    return 3;
                  } else {
                    return 0;
                  }
                })();
              }
            })();
          }
        })());
      }