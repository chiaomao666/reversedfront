
      (function (e) {
        "use strict";

        e.defineLocale("ja", {
          eras: [{
            since: "2019-05-01",
            offset: 1,
            name: "令和",
            narrow: "㋿",
            abbr: "R"
          }, {
            since: "1989-01-08",
            until: "2019-04-30",
            offset: 1,
            name: "平成",
            narrow: "㍻",
            abbr: "H"
          }, {
            since: "1926-12-25",
            until: "1989-01-07",
            offset: 1,
            name: "昭和",
            narrow: "㍼",
            abbr: "S"
          }, {
            since: "1912-07-30",
            until: "1926-12-24",
            offset: 1,
            name: "大正",
            narrow: "㍽",
            abbr: "T"
          }, {
            since: "1873-01-01",
            until: "1912-07-29",
            offset: 6,
            name: "明治",
            narrow: "㍾",
            abbr: "M"
          }, {
            since: "0001-01-01",
            until: "1873-12-31",
            offset: 1,
            name: "西暦",
            narrow: "AD",
            abbr: "AD"
          }, {
            since: "0000-12-31",
            until: -Infinity,
            offset: 1,
            name: "紀元前",
            narrow: "BC",
            abbr: "BC"
          }],
          eraYearOrdinalRegex: /(元|\d+)年/,
          eraYearOrdinalParse: function (e, t) {
            return (() => {
              if (t[1] === "元") {
                return 1;
              } else {
                return parseInt(t[1] || e, 10);
              }
            })();
          },
          months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
          weekdaysShort: "日_月_火_水_木_金_土".split("_"),
          weekdaysMin: "日_月_火_水_木_金_土".split("_"),
          longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "YYYY/MM/DD",
            LL: "YYYY年M月D日",
            LLL: "YYYY年M月D日 HH:mm",
            LLLL: "YYYY年M月D日 dddd HH:mm",
            l: "YYYY/MM/DD",
            ll: "YYYY年M月D日",
            lll: "YYYY年M月D日 HH:mm",
            llll: "YYYY年M月D日(ddd) HH:mm"
          },
          meridiemParse: /午前|午後/i,
          isPM: function (e) {
            return e === "午後";
          },
          meridiem: function (e, t, n) {
            return (() => {
              if (e < 12) {
                return "午前";
              } else {
                return "午後";
              }
            })();
          },
          calendar: {
            sameDay: "[今日] LT",
            nextDay: "[明日] LT",
            nextWeek: function (e) {
              return (() => {
                if (e.week() !== this.week()) {
                  return "[来週]dddd LT";
                } else {
                  return "dddd LT";
                }
              })();
            },
            lastDay: "[昨日] LT",
            lastWeek: function (e) {
              return (() => {
                if (this.week() !== e.week()) {
                  return "[先週]dddd LT";
                } else {
                  return "dddd LT";
                }
              })();
            },
            sameElse: "L"
          },
          dayOfMonthOrdinalParse: /\d{1,2}日/,
          ordinal: function (e, t) {
            switch (t) {
              case "y":
                return (() => {
                  if (e === 1) {
                    return "元年";
                  } else {
                    return e + "年";
                  }
                })();
              case "d":
              case "D":
              case "DDD":
                return e + "日";
              default:
                return e;
            }
          },
          relativeTime: {
            future: "%s後",
            past: "%s前",
            s: "数秒",
            ss: "%d秒",
            m: "1分",
            mm: "%d分",
            h: "1時間",
            hh: "%d時間",
            d: "1日",
            dd: "%d日",
            M: "1ヶ月",
            MM: "%dヶ月",
            y: "1年",
            yy: "%d年"
          }
        });
        e.defineLocale("ko", {
          months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
          monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
          weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
          weekdaysShort: "일_월_화_수_목_금_토".split("_"),
          weekdaysMin: "일_월_화_수_목_금_토".split("_"),
          longDateFormat: {
            LT: "A h:mm",
            LTS: "A h:mm:ss",
            L: "YYYY.MM.DD.",
            LL: "YYYY년 MMMM D일",
            LLL: "YYYY년 MMMM D일 A h:mm",
            LLLL: "YYYY년 MMMM D일 dddd A h:mm",
            l: "YYYY.MM.DD.",
            ll: "YYYY년 MMMM D일",
            lll: "YYYY년 MMMM D일 A h:mm",
            llll: "YYYY년 MMMM D일 dddd A h:mm"
          },
          calendar: {
            sameDay: "오늘 LT",
            nextDay: "내일 LT",
            nextWeek: "dddd LT",
            lastDay: "어제 LT",
            lastWeek: "지난주 dddd LT",
            sameElse: "L"
          },
          relativeTime: {
            future: "%s 후",
            past: "%s 전",
            s: "몇 초",
            ss: "%d초",
            m: "1분",
            mm: "%d분",
            h: "한 시간",
            hh: "%d시간",
            d: "하루",
            dd: "%d일",
            M: "한 달",
            MM: "%d달",
            y: "일 년",
            yy: "%d년"
          },
          dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
          ordinal: function (e, t) {
            switch (t) {
              case "d":
              case "D":
              case "DDD":
                return e + "일";
              case "M":
                return e + "월";
              case "w":
              case "W":
                return e + "주";
              default:
                return e;
            }
          },
          meridiemParse: /오전|오후/,
          isPM: function (e) {
            return e === "오후";
          },
          meridiem: function (e, t, n) {
            return (() => {
              if (e < 12) {
                return "오전";
              } else {
                return "오후";
              }
            })();
          }
        });
        e.defineLocale("zh-cn", {
          months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
          monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
          weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
          weekdaysMin: "日_一_二_三_四_五_六".split("_"),
          longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "YYYY/MM/DD",
            LL: "YYYY年M月D日",
            LLL: "YYYY年M月D日Ah点mm分",
            LLLL: "YYYY年M月D日ddddAh点mm分",
            l: "YYYY/M/D",
            ll: "YYYY年M月D日",
            lll: "YYYY年M月D日 HH:mm",
            llll: "YYYY年M月D日dddd HH:mm"
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            if (e === 12) {
              e = 0;
            }
            return (() => {
              if (t === "凌晨" || t === "早上" || t === "上午") {
                return e;
              } else {
                return (() => {
                  if (t === "下午" || t === "晚上") {
                    return e + 12;
                  } else {
                    return (() => {
                      if (e >= 11) {
                        return e;
                      } else {
                        return e + 12;
                      }
                    })();
                  }
                })();
              }
            })();
          },
          meridiem: function (e, t, n) {
            var o = e * 100 + t;
            return (() => {
              if (o < 600) {
                return "凌晨";
              } else {
                return (() => {
                  if (o < 900) {
                    return "早上";
                  } else {
                    return (() => {
                      if (o < 1130) {
                        return "上午";
                      } else {
                        return (() => {
                          if (o < 1230) {
                            return "中午";
                          } else {
                            return (() => {
                              if (o < 1800) {
                                return "下午";
                              } else {
                                return "晚上";
                              }
                            })();
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          },
          calendar: {
            sameDay: "[今天]LT",
            nextDay: "[明天]LT",
            nextWeek: function (e) {
              return (() => {
                if (e.week() !== this.week()) {
                  return "[下]dddLT";
                } else {
                  return "[本]dddLT";
                }
              })();
            },
            lastDay: "[昨天]LT",
            lastWeek: function (e) {
              return (() => {
                if (this.week() !== e.week()) {
                  return "[上]dddLT";
                } else {
                  return "[本]dddLT";
                }
              })();
            },
            sameElse: "L"
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
          ordinal: function (e, t) {
            switch (t) {
              case "d":
              case "D":
              case "DDD":
                return e + "日";
              case "M":
                return e + "月";
              case "w":
              case "W":
                return e + "周";
              default:
                return e;
            }
          },
          relativeTime: {
            future: "%s后",
            past: "%s前",
            s: "几秒",
            ss: "%d 秒",
            m: "1 分钟",
            mm: "%d 分钟",
            h: "1 小时",
            hh: "%d 小时",
            d: "1 天",
            dd: "%d 天",
            w: "1 周",
            ww: "%d 周",
            M: "1 个月",
            MM: "%d 个月",
            y: "1 年",
            yy: "%d 年"
          },
          week: {
            dow: 1,
            doy: 4
          }
        });
        e.defineLocale("zh-hk", {
          months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
          monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
          weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
          weekdaysMin: "日_一_二_三_四_五_六".split("_"),
          longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "YYYY/MM/DD",
            LL: "YYYY年M月D日",
            LLL: "YYYY年M月D日 HH:mm",
            LLLL: "YYYY年M月D日dddd HH:mm",
            l: "YYYY/M/D",
            ll: "YYYY年M月D日",
            lll: "YYYY年M月D日 HH:mm",
            llll: "YYYY年M月D日dddd HH:mm"
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            if (e === 12) {
              e = 0;
            }
            return (() => {
              if (t === "凌晨" || t === "早上" || t === "上午") {
                return e;
              } else {
                return (() => {
                  if (t === "中午") {
                    return (() => {
                      if (e >= 11) {
                        return e;
                      } else {
                        return e + 12;
                      }
                    })();
                  } else {
                    return (() => {
                      if (t === "下午" || t === "晚上") {
                        return e + 12;
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            })();
          },
          meridiem: function (e, t, n) {
            var o = e * 100 + t;
            return (() => {
              if (o < 600) {
                return "凌晨";
              } else {
                return (() => {
                  if (o < 900) {
                    return "早上";
                  } else {
                    return (() => {
                      if (o < 1200) {
                        return "上午";
                      } else {
                        return (() => {
                          if (o === 1200) {
                            return "中午";
                          } else {
                            return (() => {
                              if (o < 1800) {
                                return "下午";
                              } else {
                                return "晚上";
                              }
                            })();
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          },
          calendar: {
            sameDay: "[今天]LT",
            nextDay: "[明天]LT",
            nextWeek: "[下]ddddLT",
            lastDay: "[昨天]LT",
            lastWeek: "[上]ddddLT",
            sameElse: "L"
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case "d":
              case "D":
              case "DDD":
                return e + "日";
              case "M":
                return e + "月";
              case "w":
              case "W":
                return e + "週";
              default:
                return e;
            }
          },
          relativeTime: {
            future: "%s後",
            past: "%s前",
            s: "幾秒",
            ss: "%d 秒",
            m: "1 分鐘",
            mm: "%d 分鐘",
            h: "1 小時",
            hh: "%d 小時",
            d: "1 天",
            dd: "%d 天",
            M: "1 個月",
            MM: "%d 個月",
            y: "1 年",
            yy: "%d 年"
          }
        });
        e.defineLocale("zh-mo", {
          months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
          monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
          weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
          weekdaysMin: "日_一_二_三_四_五_六".split("_"),
          longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD/MM/YYYY",
            LL: "YYYY年M月D日",
            LLL: "YYYY年M月D日 HH:mm",
            LLLL: "YYYY年M月D日dddd HH:mm",
            l: "D/M/YYYY",
            ll: "YYYY年M月D日",
            lll: "YYYY年M月D日 HH:mm",
            llll: "YYYY年M月D日dddd HH:mm"
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            if (e === 12) {
              e = 0;
            }
            return (() => {
              if (t === "凌晨" || t === "早上" || t === "上午") {
                return e;
              } else {
                return (() => {
                  if (t === "中午") {
                    return (() => {
                      if (e >= 11) {
                        return e;
                      } else {
                        return e + 12;
                      }
                    })();
                  } else {
                    return (() => {
                      if (t === "下午" || t === "晚上") {
                        return e + 12;
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            })();
          },
          meridiem: function (e, t, n) {
            var o = e * 100 + t;
            return (() => {
              if (o < 600) {
                return "凌晨";
              } else {
                return (() => {
                  if (o < 900) {
                    return "早上";
                  } else {
                    return (() => {
                      if (o < 1130) {
                        return "上午";
                      } else {
                        return (() => {
                          if (o < 1230) {
                            return "中午";
                          } else {
                            return (() => {
                              if (o < 1800) {
                                return "下午";
                              } else {
                                return "晚上";
                              }
                            })();
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          },
          calendar: {
            sameDay: "[今天] LT",
            nextDay: "[明天] LT",
            nextWeek: "[下]dddd LT",
            lastDay: "[昨天] LT",
            lastWeek: "[上]dddd LT",
            sameElse: "L"
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case "d":
              case "D":
              case "DDD":
                return e + "日";
              case "M":
                return e + "月";
              case "w":
              case "W":
                return e + "週";
              default:
                return e;
            }
          },
          relativeTime: {
            future: "%s內",
            past: "%s前",
            s: "幾秒",
            ss: "%d 秒",
            m: "1 分鐘",
            mm: "%d 分鐘",
            h: "1 小時",
            hh: "%d 小時",
            d: "1 天",
            dd: "%d 天",
            M: "1 個月",
            MM: "%d 個月",
            y: "1 年",
            yy: "%d 年"
          }
        });
        e.defineLocale("zh-tw", {
          months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
          monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
          weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
          weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
          weekdaysMin: "日_一_二_三_四_五_六".split("_"),
          longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "YYYY/MM/DD",
            LL: "YYYY年M月D日",
            LLL: "YYYY年M月D日 HH:mm",
            LLLL: "YYYY年M月D日dddd HH:mm",
            l: "YYYY/M/D",
            ll: "YYYY年M月D日",
            lll: "YYYY年M月D日 HH:mm",
            llll: "YYYY年M月D日dddd HH:mm"
          },
          meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
          meridiemHour: function (e, t) {
            if (e === 12) {
              e = 0;
            }
            return (() => {
              if (t === "凌晨" || t === "早上" || t === "上午") {
                return e;
              } else {
                return (() => {
                  if (t === "中午") {
                    return (() => {
                      if (e >= 11) {
                        return e;
                      } else {
                        return e + 12;
                      }
                    })();
                  } else {
                    return (() => {
                      if (t === "下午" || t === "晚上") {
                        return e + 12;
                      } else {
                        return undefined;
                      }
                    })();
                  }
                })();
              }
            })();
          },
          meridiem: function (e, t, n) {
            var o = e * 100 + t;
            return (() => {
              if (o < 600) {
                return "凌晨";
              } else {
                return (() => {
                  if (o < 900) {
                    return "早上";
                  } else {
                    return (() => {
                      if (o < 1130) {
                        return "上午";
                      } else {
                        return (() => {
                          if (o < 1230) {
                            return "中午";
                          } else {
                            return (() => {
                              if (o < 1800) {
                                return "下午";
                              } else {
                                return "晚上";
                              }
                            })();
                          }
                        })();
                      }
                    })();
                  }
                })();
              }
            })();
          },
          calendar: {
            sameDay: "[今天] LT",
            nextDay: "[明天] LT",
            nextWeek: "[下]dddd LT",
            lastDay: "[昨天] LT",
            lastWeek: "[上]dddd LT",
            sameElse: "L"
          },
          dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
          ordinal: function (e, t) {
            switch (t) {
              case "d":
              case "D":
              case "DDD":
                return e + "日";
              case "M":
                return e + "月";
              case "w":
              case "W":
                return e + "週";
              default:
                return e;
            }
          },
          relativeTime: {
            future: "%s後",
            past: "%s前",
            s: "幾秒",
            ss: "%d 秒",
            m: "1 分鐘",
            mm: "%d 分鐘",
            h: "1 小時",
            hh: "%d 小時",
            d: "1 天",
            dd: "%d 天",
            M: "1 個月",
            MM: "%d 個月",
            y: "1 年",
            yy: "%d 年"
          }
        });
        e.locale("en");
      })(n(72426));
    }