
      "use strict";

      e.exports = function (e, t, n, o, a) {
        e.config = t;
        if (n) {
          e.code = n;
        }
        e.request = o;
        e.response = a;
        e.isAxiosError = true;
        e.toJSON = function () {
          return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: this.config,
            code: this.code,
            status: (() => {
              if (this.response && this.response.status) {
                return this.response.status;
              } else {
                return null;
              }
            })()
          };
        };
        return e;
      };
    }