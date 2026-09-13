
        return Number((() => {
          if (e == 1) {
            return 0;
          } else {
            return (() => {
              if (e == 2) {
                return 1;
              } else {
                return (() => {
                  if (e < 7) {
                    return 2;
                  } else {
                    return (() => {
                      if (e < 11) {
                        return 3;
                      } else {
                        return 4;
                      }
                    })();
                  }
                })();
              }
            })();
          }
        })());
      }