
      "use strict";

      var o = n(95318);
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.default = undefined;
      var a = o(n(66293));
      var r = o(n(60291));
      var i = o(n(72644));
      var s = o(n(64430));
      var c = "${label} is not a valid ${type}";
      var l = {
        locale: "en",
        Pagination: a.default,
        DatePicker: r.default,
        TimePicker: i.default,
        Calendar: s.default,
        global: {
          placeholder: "Please select"
        },
        Table: {
          filterTitle: "Filter menu",
          filterConfirm: "OK",
          filterReset: "Reset",
          filterEmptyText: "No filters",
          filterCheckall: "Select all items",
          filterSearchPlaceholder: "Search in filters",
          emptyText: "No data",
          selectAll: "Select current page",
          selectInvert: "Invert current page",
          selectNone: "Clear all data",
          selectionAll: "Select all data",
          sortTitle: "Sort",
          expand: "Expand row",
          collapse: "Collapse row",
          triggerDesc: "Click to sort descending",
          triggerAsc: "Click to sort ascending",
          cancelSort: "Click to cancel sorting"
        },
        Modal: {
          okText: "OK",
          cancelText: "Cancel",
          justOkText: "OK"
        },
        Popconfirm: {
          okText: "OK",
          cancelText: "Cancel"
        },
        Transfer: {
          titles: ["", ""],
          searchPlaceholder: "Search here",
          itemUnit: "item",
          itemsUnit: "items",
          remove: "Remove",
          selectCurrent: "Select current page",
          removeCurrent: "Remove current page",
          selectAll: "Select all data",
          removeAll: "Remove all data",
          selectInvert: "Invert current page"
        },
        Upload: {
          uploading: "Uploading...",
          removeFile: "Remove file",
          uploadError: "Upload error",
          previewFile: "Preview file",
          downloadFile: "Download file"
        },
        Empty: {
          description: "No Data"
        },
        Icon: {
          icon: "icon"
        },
        Text: {
          edit: "Edit",
          copy: "Copy",
          copied: "Copied",
          expand: "Expand"
        },
        PageHeader: {
          back: "Back"
        },
        Form: {
          optional: "(optional)",
          defaultValidateMessages: {
            default: "Field validation error for ${label}",
            required: "Please enter ${label}",
            enum: "${label} must be one of [${enum}]",
            whitespace: "${label} cannot be a blank character",
            date: {
              format: "${label} date format is invalid",
              parse: "${label} cannot be converted to a date",
              invalid: "${label} is an invalid date"
            },
            types: {
              string: c,
              method: c,
              array: c,
              object: c,
              number: c,
              date: c,
              boolean: c,
              integer: c,
              float: c,
              regexp: c,
              email: c,
              url: c,
              hex: c
            },
            string: {
              len: "${label} must be ${len} characters",
              min: "${label} must be at least ${min} characters",
              max: "${label} must be up to ${max} characters",
              range: "${label} must be between ${min}-${max} characters"
            },
            number: {
              len: "${label} must be equal to ${len}",
              min: "${label} must be minimum ${min}",
              max: "${label} must be maximum ${max}",
              range: "${label} must be between ${min}-${max}"
            },
            array: {
              len: "Must be ${len} ${label}",
              min: "At least ${min} ${label}",
              max: "At most ${max} ${label}",
              range: "The amount of ${label} must be between ${min}-${max}"
            },
            pattern: {
              mismatch: "${label} does not match the pattern ${pattern}"
            }
          }
        },
        Image: {
          preview: "Preview"
        }
      };
      t.default = l;
    }