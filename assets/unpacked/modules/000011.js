
        return Number((() => {
          if (e == 1 || e == 11) {
            return 0;
          } else {
            return (() => {
              if (e == 2 || e == 12) {
                return 1;
              } else {
                return (() => {
                  if (e > 2 && e < 20) {
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