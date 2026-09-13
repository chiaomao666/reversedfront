
      "use strict";

      var o = n(95318);
      t.Z = undefined;
      var a = o(n(66639));
      var r = o(n(70355));
      var i = o(n(45340));
      var s = o(n(71512));
      var c = "${label}は有効な${type}ではありません";
      var l = {
        locale: "ja",
        Pagination: a.default,
        DatePicker: r.default,
        TimePicker: i.default,
        Calendar: s.default,
        Table: {
          filterTitle: "フィルター",
          filterConfirm: "OK",
          filterReset: "リセット",
          filterEmptyText: "フィルターなし",
          selectAll: "ページ単位で選択",
          selectInvert: "ページ単位で反転",
          selectionAll: "すべてを選択",
          sortTitle: "ソート",
          expand: "展開する",
          collapse: "折り畳む",
          triggerDesc: "クリックで降順にソート",
          triggerAsc: "クリックで昇順にソート",
          cancelSort: "ソートをキャンセル"
        },
        Modal: {
          okText: "OK",
          cancelText: "キャンセル",
          justOkText: "OK"
        },
        Popconfirm: {
          okText: "OK",
          cancelText: "キャンセル"
        },
        Transfer: {
          searchPlaceholder: "ここを検索",
          itemUnit: "アイテム",
          itemsUnit: "アイテム"
        },
        Upload: {
          uploading: "アップロード中...",
          removeFile: "ファイルを削除",
          uploadError: "アップロードエラー",
          previewFile: "ファイルをプレビュー",
          downloadFile: "ダウンロードファイル"
        },
        Empty: {
          description: "データがありません"
        },
        Form: {
          defaultValidateMessages: {
            default: "${label}のフィールド検証エラー",
            required: "${label}を入力してください",
            enum: "${label}は[${enum}]のいずれかである必要があります",
            whitespace: "${label}は空白文字にすることはできません",
            date: {
              format: "${label}の日付形式は不正です",
              parse: "${label}は日付に変換できません",
              invalid: "${label}は不正な日付です"
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
              len: "${label}は${len}文字である必要があります",
              min: "${label}は${min}文字以上である必要があります",
              max: "${label}は${max}文字以下である必要があります",
              range: "${label}は${min}-${max}文字の範囲である必要があります"
            },
            number: {
              len: "${label}は${len}と等しい必要があります",
              min: "${label}の最小値は${min}です",
              max: "${label}の最大値は${max}です",
              range: "${label}は${min}-${max}の範囲である必要があります"
            },
            array: {
              len: "${label}は${len}である必要があります",
              min: "${label}の最小は${min}です",
              max: "${label}の最大は${max}です",
              range: "${label}の合計は${min}-${max}の範囲である必要があります"
            },
            pattern: {
              mismatch: "${label}はパターン${pattern}と一致しません"
            }
          }
        }
      };
      t.Z = l;
    }