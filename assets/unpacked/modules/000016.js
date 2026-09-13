
        return Number((() => {
          if (e % 10 == 1 && e % 100 != 11) {
            return 0;
          } else {
            return (() => {
              if (e !== 0) {
                return 1;
              } else {
                return 2;
              }
            })();
          }
        })());
      }