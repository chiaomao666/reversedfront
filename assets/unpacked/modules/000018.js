
        return Number((() => {
          if (e == 0) {
            return 0;
          } else {
            return (() => {
              if (e == 1) {
                return 1;
              } else {
                return 2;
              }
            })();
          }
        })());
      }