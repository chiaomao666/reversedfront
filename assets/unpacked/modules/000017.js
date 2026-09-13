
        return Number((() => {
          if (e == 1 || e % 10 == 1 && e % 100 != 11) {
            return 0;
          } else {
            return 1;
          }
        })());
      }