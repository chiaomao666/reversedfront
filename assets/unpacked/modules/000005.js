
        return Number((() => {
          if (e == 0) {
            return 0;
          } else {
            return (() => {
              if (e == 1) {
                return 1;
              } else {
                return (() => {
                  if (e == 2) {
                    return 2;
                  } else {
                    return (() => {
                      if (e % 100 >= 3 && e % 100 <= 10) {
                        return 3;
                      } else {
                        return (() => {
                          if (e % 100 >= 11) {
                            return 4;
                          } else {
                            return 5;
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          }
        })());
      }