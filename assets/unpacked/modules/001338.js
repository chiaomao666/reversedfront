
      var o;
      (function (a, r) {
        "use strict";

        var i = "function";
        var s = "undefined";
        var c = "object";
        var l = "string";
        var u = "major";
        var p = "model";
        var d = "name";
        var f = "type";
        var b = "vendor";
        var M = "version";
        var A = "architecture";
        var m = "console";
        var h = "mobile";
        var z = "tablet";
        var O = "smarttv";
        var g = "wearable";
        var v = "embedded";
        var y = "Amazon";
        var q = "Apple";
        var _ = "ASUS";
        var x = "BlackBerry";
        var W = "Firefox";
        var w = "Google";
        var R = "Huawei";
        var k = "LG";
        var L = "Microsoft";
        var S = "Motorola";
        var N = "Opera";
        var C = "Samsung";
        var E = "Sharp";
        var B = "Sony";
        var T = "Xiaomi";
        var j = "Zebra";
        var I = "Facebook";
        var D = "Chromium OS";
        var P = "Mac OS";
        function V(e) {
          var t = {};
          for (var n = 0; n < e.length; n++) {
            t[e[n].toUpperCase()] = e[n];
          }
          return t;
        }
        function X(e, t) {
          return typeof e === l && Y(t).indexOf(Y(e)) !== -1;
        }
        function Y(e) {
          return e.toLowerCase();
        }
        function F(e, t) {
          if (typeof e === l) {
            e = e.replace(/^\s\s*/, "");
            return (() => {
              if (typeof t === s) {
                return e;
              } else {
                return e.substring(0, 350);
              }
            })();
          }
        }
        function U(e, t) {
          var n;
          var o;
          var a;
          var s;
          for (var l, u, p = 0; p < t.length && !l;) {
            var d = t[p];
            var f = t[p + 1];
            for (n = o = 0; n < d.length && !l && d[n];) {
              if (l = d[n++].exec(e)) {
                for (a = 0; a < f.length; a++) {
                  u = l[++o];
                  (() => {
                    if (typeof (s = f[a]) === c && s.length > 0) {
                      return (() => {
                        if (s.length === 2) {
                          return (() => {
                            if (typeof s[1] == i) {
                              return this[s[0]] = s[1].call(this, u);
                            } else {
                              return this[s[0]] = s[1];
                            }
                          })();
                        } else {
                          return (() => {
                            if (s.length === 3) {
                              return (() => {
                                if (typeof s[1] !== i || s[1].exec && s[1].test) {
                                  return this[s[0]] = (() => {
                                    if (u) {
                                      return u.replace(s[1], s[2]);
                                    } else {
                                      return r;
                                    }
                                  })();
                                } else {
                                  return this[s[0]] = (() => {
                                    if (u) {
                                      return s[1].call(this, u, s[2]);
                                    } else {
                                      return r;
                                    }
                                  })();
                                }
                              })();
                            } else {
                              return s.length === 4 && (this[s[0]] = (() => {
                                if (u) {
                                  return s[3].call(this, u.replace(s[1], s[2]));
                                } else {
                                  return r;
                                }
                              })());
                            }
                          })();
                        }
                      })();
                    } else {
                      return this[s] = u || r;
                    }
                  })();
                }
              }
            }
            p += 2;
          }
        }
        function H(e, t) {
          for (var n in t) {
            if (typeof t[n] === c && t[n].length > 0) {
              for (var o = 0; o < t[n].length; o++) {
                if (X(t[n][o], e)) {
                  return (() => {
                    if (n === "?") {
                      return r;
                    } else {
                      return n;
                    }
                  })();
                }
              }
            } else if (X(t[n], e)) {
              return (() => {
                if (n === "?") {
                  return r;
                } else {
                  return n;
                }
              })();
            }
          }
          return e;
        }
        var Q = {
          ME: "4.90",
          "NT 3.11": "NT3.51",
          "NT 4.0": "NT4.0",
          2000: "NT 5.0",
          XP: ["NT 5.1", "NT 5.2"],
          Vista: "NT 6.0",
          7: "NT 6.1",
          8: "NT 6.2",
          8.1: "NT 6.3",
          10: ["NT 6.4", "NT 10.0"],
          RT: "ARM"
        };
        var K = {
          browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [M, [d, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [M, [d, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [d, M], [/opios[\/ ]+([\w\.]+)/i], [M, [d, "Opera Mini"]], [/\bopr\/([\w\.]+)/i], [M, [d, N]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [d, M], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [M, [d, "UCBrowser"]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [M, [d, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [M, [d, "WeChat"]], [/konqueror\/([\w\.]+)/i], [M, [d, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [M, [d, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [M, [d, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[d, /(.+)/, "$1 Secure Browser"], M], [/\bfocus\/([\w\.]+)/i], [M, [d, "Firefox Focus"]], [/\bopt\/([\w\.]+)/i], [M, [d, "Opera Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [M, [d, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [M, [d, "Dolphin"]], [/coast\/([\w\.]+)/i], [M, [d, "Opera Coast"]], [/miuibrowser\/([\w\.]+)/i], [M, [d, "MIUI Browser"]], [/fxios\/([-\w\.]+)/i], [M, [d, W]], [/\bqihu|(qi?ho?o?|360)browser/i], [[d, "360 Browser"]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[d, /(.+)/, "$1 Browser"], M], [/(comodo_dragon)\/([\w\.]+)/i], [[d, /_/g, " "], M], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [d, M], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [d], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[d, I], M], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [d, M], [/\bgsa\/([\w\.]+) .*safari\//i], [M, [d, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [M, [d, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [M, [d, "Chrome Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[d, "Chrome WebView"], M], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [M, [d, "Android Browser"]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [d, M], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [M, [d, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [M, d], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [d, [M, H, {
            "1.0": "/8",
            1.2: "/1",
            1.3: "/3",
            "2.0": "/412",
            "2.0.2": "/416",
            "2.0.3": "/417",
            "2.0.4": "/419",
            "?": "/"
          }]], [/(webkit|khtml)\/([\w\.]+)/i], [d, M], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[d, "Netscape"], M], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [M, [d, "Firefox Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [d, M], [/(cobalt)\/([\w\.]+)/i], [d, [M, /master.|lts./, ""]]],
          cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[A, "amd64"]], [/(ia32(?=;))/i], [[A, Y]], [/((?:i[346]|x)86)[;\)]/i], [[A, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[A, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[A, "armhf"]], [/windows (ce|mobile); ppc;/i], [[A, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[A, /ower/, "", Y]], [/(sun4\w)[;\)]/i], [[A, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[A, Y]]],
          device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [p, [b, C], [f, z]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [p, [b, C], [f, h]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [p, [b, q], [f, h]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [p, [b, q], [f, z]], [/(macintosh);/i], [p, [b, q]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [p, [b, E], [f, h]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [p, [b, R], [f, z]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [p, [b, R], [f, h]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[p, /_/g, " "], [b, T], [f, h]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[p, /_/g, " "], [b, T], [f, z]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [p, [b, "OPPO"], [f, h]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [p, [b, "Vivo"], [f, h]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [p, [b, "Realme"], [f, h]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [p, [b, S], [f, h]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [p, [b, S], [f, z]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [p, [b, k], [f, z]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [p, [b, k], [f, h]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [p, [b, "Lenovo"], [f, z]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[p, /_/g, " "], [b, "Nokia"], [f, h]], [/(pixel c)\b/i], [p, [b, w], [f, z]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [p, [b, w], [f, h]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [p, [b, B], [f, h]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[p, "Xperia Tablet"], [b, B], [f, z]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [p, [b, "OnePlus"], [f, h]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [p, [b, y], [f, z]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[p, /(.+)/g, "Fire Phone $1"], [b, y], [f, h]], [/(playbook);[-\w\),; ]+(rim)/i], [p, b, [f, z]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [p, [b, x], [f, h]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [p, [b, _], [f, z]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [p, [b, _], [f, h]], [/(nexus 9)/i], [p, [b, "HTC"], [f, z]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [b, [p, /_/g, " "], [f, h]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [p, [b, "Acer"], [f, z]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [p, [b, "Meizu"], [f, h]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [b, p, [f, h]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [b, p, [f, z]], [/(surface duo)/i], [p, [b, L], [f, z]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [p, [b, "Fairphone"], [f, h]], [/(u304aa)/i], [p, [b, "AT&T"], [f, h]], [/\bsie-(\w*)/i], [p, [b, "Siemens"], [f, h]], [/\b(rct\w+) b/i], [p, [b, "RCA"], [f, z]], [/\b(venue[\d ]{2,7}) b/i], [p, [b, "Dell"], [f, z]], [/\b(q(?:mv|ta)\w+) b/i], [p, [b, "Verizon"], [f, z]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [p, [b, "Barnes & Noble"], [f, z]], [/\b(tm\d{3}\w+) b/i], [p, [b, "NuVision"], [f, z]], [/\b(k88) b/i], [p, [b, "ZTE"], [f, z]], [/\b(nx\d{3}j) b/i], [p, [b, "ZTE"], [f, h]], [/\b(gen\d{3}) b.+49h/i], [p, [b, "Swiss"], [f, h]], [/\b(zur\d{3}) b/i], [p, [b, "Swiss"], [f, z]], [/\b((zeki)?tb.*\b) b/i], [p, [b, "Zeki"], [f, z]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[b, "Dragon Touch"], p, [f, z]], [/\b(ns-?\w{0,9}) b/i], [p, [b, "Insignia"], [f, z]], [/\b((nxa|next)-?\w{0,9}) b/i], [p, [b, "NextBook"], [f, z]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[b, "Voice"], p, [f, h]], [/\b(lvtel\-)?(v1[12]) b/i], [[b, "LvTel"], p, [f, h]], [/\b(ph-1) /i], [p, [b, "Essential"], [f, h]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [p, [b, "Envizen"], [f, z]], [/\b(trio[-\w\. ]+) b/i], [p, [b, "MachSpeed"], [f, z]], [/\btu_(1491) b/i], [p, [b, "Rotor"], [f, z]], [/(shield[\w ]+) b/i], [p, [b, "Nvidia"], [f, z]], [/(sprint) (\w+)/i], [b, p, [f, h]], [/(kin\.[onetw]{3})/i], [[p, /\./g, " "], [b, L], [f, h]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [p, [b, j], [f, z]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [p, [b, j], [f, h]], [/smart-tv.+(samsung)/i], [b, [f, O]], [/hbbtv.+maple;(\d+)/i], [[p, /^/, "SmartTV"], [b, C], [f, O]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[b, k], [f, O]], [/(apple) ?tv/i], [b, [p, "Apple TV"], [f, O]], [/crkey/i], [[p, "Chromecast"], [b, w], [f, O]], [/droid.+aft(\w)( bui|\))/i], [p, [b, y], [f, O]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [p, [b, E], [f, O]], [/(bravia[\w ]+)( bui|\))/i], [p, [b, B], [f, O]], [/(mitv-\w{5}) bui/i], [p, [b, T], [f, O]], [/Hbbtv.*(technisat) (.*);/i], [b, p, [f, O]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[b, F], [p, F], [f, O]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[f, O]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [b, p, [f, m]], [/droid.+; (shield) bui/i], [p, [b, "Nvidia"], [f, m]], [/(playstation [345portablevi]+)/i], [p, [b, B], [f, m]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [p, [b, L], [f, m]], [/((pebble))app/i], [b, p, [f, g]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [p, [b, q], [f, g]], [/droid.+; (glass) \d/i], [p, [b, w], [f, g]], [/droid.+; (wt63?0{2,3})\)/i], [p, [b, j], [f, g]], [/(quest( 2| pro)?)/i], [p, [b, I], [f, g]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [b, [f, v]], [/(aeobc)\b/i], [p, [b, y], [f, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [p, [f, h]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [p, [f, z]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[f, z]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[f, h]], [/(android[-\w\. ]{0,9});.+buil/i], [p, [b, "Generic"]]],
          engine: [[/windows.+ edge\/([\w\.]+)/i], [M, [d, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [M, [d, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [d, M], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [M, d]],
          os: [[/microsoft (windows) (vista|xp)/i], [d, M], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [d, [M, H, Q]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[d, "Windows"], [M, H, Q]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[M, /_/g, "."], [d, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[d, P], [M, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [M, d], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [d, M], [/\(bb(10);/i], [M, [d, x]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [M, [d, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [M, [d, "Firefox OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [M, [d, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [M, [d, "watchOS"]], [/crkey\/([\d\.]+)/i], [M, [d, "Chromecast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[d, D], M], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [d, M], [/(sunos) ?([\w\.\d]*)/i], [[d, "Solaris"], M], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [d, M]]
        };
        var J = function e(t, n) {
          if (typeof t === c) {
            n = t;
            t = r;
          }
          if (!(this instanceof e)) {
            return new e(t, n).getResult();
          }
          var o = (() => {
            if (typeof a !== s && a.navigator) {
              return a.navigator;
            } else {
              return r;
            }
          })();
          var u = t || (() => {
            if (o && o.userAgent) {
              return o.userAgent;
            } else {
              return "";
            }
          })();
          var p = (() => {
            if (o && o.userAgentData) {
              return o.userAgentData;
            } else {
              return r;
            }
          })();
          var d = (() => {
            if (n) {
              return function (e, t) {
                var n = {};
                for (var o in e) {
                  (() => {
                    if (t[o] && t[o].length % 2 === 0) {
                      return n[o] = t[o].concat(e[o]);
                    } else {
                      return n[o] = e[o];
                    }
                  })();
                }
                return n;
              }(K, n);
            } else {
              return K;
            }
          })();
          var f = o && o.userAgent == u;
          this.getBrowser = function () {
            var e;
            var t = {
              name: r,
              version: r
            };
            U.call(t, u, d.browser);
            t.major = (() => {
              if (typeof (e = t.version) === l) {
                return e.replace(/[^\d\.]/g, "").split(".")[0];
              } else {
                return r;
              }
            })();
            if (f && o && o.brave && typeof o.brave.isBrave == i) {
              t.name = "Brave";
            }
            return t;
          };
          this.getCPU = function () {
            var e = {
              architecture: r
            };
            U.call(e, u, d.cpu);
            return e;
          };
          this.getDevice = function () {
            var e = {
              vendor: r,
              model: r,
              type: r
            };
            U.call(e, u, d.device);
            if (f && !e.type && p && p.mobile) {
              e.type = h;
            }
            if (f && e.model == "Macintosh" && o && typeof o.standalone !== s && o.maxTouchPoints && o.maxTouchPoints > 2) {
              e.model = "iPad";
              e.type = z;
            }
            return e;
          };
          this.getEngine = function () {
            var e = {
              name: r,
              version: r
            };
            U.call(e, u, d.engine);
            return e;
          };
          this.getOS = function () {
            var e = {
              name: r,
              version: r
            };
            U.call(e, u, d.os);
            if (f && !e.name && p && p.platform != "Unknown") {
              e.name = p.platform.replace(/chrome os/i, D).replace(/macos/i, P);
            }
            return e;
          };
          this.getResult = function () {
            return {
              ua: this.getUA(),
              browser: this.getBrowser(),
              engine: this.getEngine(),
              os: this.getOS(),
              device: this.getDevice(),
              cpu: this.getCPU()
            };
          };
          this.getUA = function () {
            return u;
          };
          this.setUA = function (e) {
            u = (() => {
              if (typeof e === l && e.length > 350) {
                return F(e, 350);
              } else {
                return e;
              }
            })();
            return this;
          };
          this.setUA(u);
          return this;
        };
        J.VERSION = "1.0.35";
        J.BROWSER = V([d, M, u]);
        J.CPU = V([A]);
        J.DEVICE = V([p, b, f, m, h, O, z, g, v]);
        J.ENGINE = J.OS = V([d, M]);
        (() => {
          if (typeof t !== s) {
            if (e.exports) {
              t = e.exports = J;
            }
            return t.UAParser = J;
          } else {
            return (() => {
              if (n.amdO) {
                return (o = function () {
                  return J;
                }.call(t, n, t, e)) === r || (e.exports = o);
              } else {
                return typeof a !== s && (a.UAParser = J);
              }
            })();
          }
        })();
        var G = typeof a !== s && (a.jQuery || a.Zepto);
        if (G && !G.ua) {
          var Z = new J();
          G.ua = Z.getResult();
          G.ua.get = function () {
            return Z.getUA();
          };
          G.ua.set = function (e) {
            Z.setUA(e);
            var t = Z.getResult();
            for (var n in t) {
              G.ua[n] = t[n];
            }
          };
        }
      })((() => {
        if (typeof window === "object") {
          return window;
        } else {
          return this;
        }
      })());
    }