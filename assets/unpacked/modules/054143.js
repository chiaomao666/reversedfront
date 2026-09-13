
      e.exports = function (e) {
        var t = {};
        function n(o) {
          if (t[o]) {
            return t[o].exports;
          }
          var a = t[o] = {
            i: o,
            l: false,
            exports: {}
          };
          e[o].call(a.exports, a, a.exports, n);
          a.l = true;
          return a.exports;
        }
        n.m = e;
        n.c = t;
        n.d = function (e, t, o) {
          if (!n.o(e, t)) {
            Object.defineProperty(e, t, {
              configurable: false,
              enumerable: true,
              get: o
            });
          }
        };
        n.r = function (e) {
          Object.defineProperty(e, "__esModule", {
            value: true
          });
        };
        n.n = function (e) {
          var t = (() => {
            if (e && e.__esModule) {
              return function () {
                return e.default;
              };
            } else {
              return function () {
                return e;
              };
            }
          })();
          n.d(t, "a", t);
          return t;
        };
        n.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        };
        n.p = "";
        return n(n.s = 8);
      }([function (e, t, n) {
        e.exports = n(6)();
      }, function (e, t) {
        e.exports = n(72791);
      }, function (e, t, n) {
        e.exports = function (e, t) {
          var o = "";
          (t = t || "aA0").split("").forEach(function (e) {
            (() => {
              if (isNaN(parseInt(e))) {
                return (() => {
                  if (/[a-z]/.test(e)) {
                    return o += "abcdefghijklmnopqrstuvwxyz";
                  } else {
                    return (() => {
                      if (/[A-Z]/.test(e)) {
                        return o += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                      } else {
                        return o += "~!@#$%^&()_+-={}[];',";
                      }
                    })();
                  }
                })();
              } else {
                return o += "0123456789";
              }
            })();
          });
          e = e || 30;
          var a = "";
          while (e--) {
            a += o.charAt(Math.floor(Math.random() * o.length));
          }
          return a;
        };
      }, function (e, t, n) {
        "use strict";

        e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
      }, function (e, t, n) {
        "use strict";

        e.exports = function (e, t, n, o, a, r, i, s) {
          if (!e) {
            var c;
            if (t === undefined) {
              c = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
            } else {
              var l = [n, o, a, r, i, s];
              var u = 0;
              (c = new Error(t.replace(/%s/g, function () {
                return l[u++];
              }))).name = "Invariant Violation";
            }
            c.framesToPop = 1;
            throw c;
          }
        };
      }, function (e, t, n) {
        "use strict";

        function o(e) {
          return function () {
            return e;
          };
        }
        function a() {}
        a.thatReturns = o;
        a.thatReturnsFalse = o(false);
        a.thatReturnsTrue = o(true);
        a.thatReturnsNull = o(null);
        a.thatReturnsThis = function () {
          return this;
        };
        a.thatReturnsArgument = function (e) {
          return e;
        };
        e.exports = a;
      }, function (e, t, n) {
        "use strict";

        var o = n(5);
        var a = n(4);
        var r = n(3);
        e.exports = function () {
          function e(e, t, n, o, i, s) {
            if (s !== r) {
              a(false, "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
            }
          }
          function t() {
            return e;
          }
          e.isRequired = e;
          var n = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t
          };
          n.checkPropTypes = o;
          n.PropTypes = n;
          return n;
        };
      }, function (e, t, n) {
        "use strict";

        n.r(t);
        var o = n(1);
        var a = n.n(o);
        var r = n(0);
        var i = n.n(r);
        var s = n(2);
        var c = n.n(s);
        var l = function () {
          function e(e, t) {
            var n;
            for (var o = 0; o < t.length; o++) {
              (n = t[o]).enumerable = n.enumerable || false;
              n.configurable = true;
              if ("value" in n) {
                n.writable = true;
              }
              Object.defineProperty(e, n.key, n);
            }
          }
          return function (t, n, o) {
            if (n) {
              e(t.prototype, n);
            }
            if (o) {
              e(t, o);
            }
            return t;
          };
        }();
        var u = function (e) {
          function t(e) {
            (function (e, t) {
              if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function");
              }
            })(this, t);
            var n = function (e, t) {
              if (!e) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return (() => {
                if (!t || typeof t != "object" && typeof t != "function") {
                  return e;
                } else {
                  return t;
                }
              })();
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
            p.call(n);
            var o = n.props;
            var a = o.isResponsive;
            var r = o.startAt;
            var i = o.endAt;
            var s = o.fps;
            var l = o.steps;
            var u = o.direction;
            n.id = "react-responsive-spritesheet--" + c()(8);
            n.spriteEl = n.spriteElContainer = n.spriteElMove = n.imageSprite = n.cols = n.rows = null;
            n.intervalSprite = false;
            n.isResponsive = a;
            n.startAt = n.setStartAt(r);
            n.endAt = n.setEndAt(i);
            n.fps = s;
            n.steps = l;
            n.completeLoopCicles = 0;
            n.isPlaying = false;
            n.spriteScale = 1;
            n.direction = n.setDirection(u);
            n.frame = (() => {
              if (n.startAt) {
                return n.startAt;
              } else {
                return (() => {
                  if (n.direction === "rewind") {
                    return n.steps - 1;
                  } else {
                    return 0;
                  }
                })();
              }
            })();
            return n;
          }
          (function (e, t) {
            if (typeof t != "function" && t !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            }
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
            if (t) {
              (() => {
                if (Object.setPrototypeOf) {
                  return Object.setPrototypeOf(e, t);
                } else {
                  return e.__proto__ = t;
                }
              })();
            }
          })(t, o.Component);
          l(t, [{
            key: "componentDidMount",
            value: function () {
              this.init();
            }
          }, {
            key: "componentWillUnmount",
            value: function () {
              window.removeEventListener("resize", this.resize);
            }
          }, {
            key: "setFps",
            value: function (e) {
              this.fps = e;
              this.setIntervalPlayFunctions();
            }
          }, {
            key: "setInstance",
            value: function () {
              return {
                play: this.play,
                pause: this.pause,
                goToAndPlay: this.goToAndPlay,
                goToAndPause: this.goToAndPause,
                setStartAt: this.setStartAt,
                setEndAt: this.setEndAt,
                setFps: this.setFps,
                setDirection: this.setDirection,
                getInfo: this.getInfo
              };
            }
          }, {
            key: "render",
            value: function () {
              return this.renderElements();
            }
          }]);
          return t;
        }();
        function p() {
          var e = this;
          this.renderElements = function () {
            var t = e.props;
            var n = t.image;
            var o = t.className;
            var r = t.style;
            var i = t.widthFrame;
            var s = t.heightFrame;
            var c = t.background;
            var l = t.backgroundSize;
            var u = t.backgroundRepeat;
            var p = t.backgroundPosition;
            var d = t.onClick;
            var f = t.onDoubleClick;
            var b = t.onMouseMove;
            var M = t.onMouseEnter;
            var A = t.onMouseLeave;
            var m = t.onMouseOver;
            var h = t.onMouseOut;
            var z = t.onMouseDown;
            var O = t.onMouseUp;
            var g = {
              position: "relative",
              overflow: "hidden",
              width: i + "px",
              height: s + "px",
              transform: "scale(" + e.spriteScale + ")",
              transformOrigin: "0 0",
              backgroundImage: "url(" + c + ")",
              backgroundSize: l,
              backgroundRepeat: u,
              backgroundPosition: p
            };
            var v = a.a.createElement("div", {
              className: "react-responsive-spritesheet-container__move",
              style: {
                overflow: "hidden",
                backgroundRepeat: "no-repeat",
                display: "table-cell",
                backgroundImage: "url(" + n + ")",
                width: i + "px",
                height: s + "px",
                transformOrigin: "0 50%"
              }
            });
            var y = a.a.createElement("div", {
              className: "react-responsive-spritesheet-container",
              style: g
            }, v);
            return a.a.createElement("div", {
              className: "react-responsive-spritesheet " + e.id + " " + o,
              style: r,
              onClick: function () {
                return d(e.setInstance());
              },
              onDoubleClick: function () {
                return f(e.setInstance());
              },
              onMouseMove: function () {
                return b(e.setInstance());
              },
              onMouseEnter: function () {
                return M(e.setInstance());
              },
              onMouseLeave: function () {
                return A(e.setInstance());
              },
              onMouseOver: function () {
                return m(e.setInstance());
              },
              onMouseOut: function () {
                return h(e.setInstance());
              },
              onMouseDown: function () {
                return z(e.setInstance());
              },
              onMouseUp: function () {
                return O(e.setInstance());
              }
            }, y);
          };
          this.init = function () {
            var t = e.props;
            var n = t.image;
            var o = t.widthFrame;
            var a = t.heightFrame;
            var r = t.autoplay;
            var i = t.getInstance;
            var s = t.onInit;
            var c = new Image();
            c.src = n;
            c.onload = function () {
              if (document && document.querySelector("." + e.id)) {
                e.imageSprite = c;
                e.cols = (() => {
                  if (e.imageSprite.width === o) {
                    return 1;
                  } else {
                    return e.imageSprite.width / o;
                  }
                })();
                e.rows = (() => {
                  if (e.imageSprite.height === a) {
                    return 1;
                  } else {
                    return e.imageSprite.height / a;
                  }
                })();
                e.spriteEl = document.querySelector("." + e.id);
                e.spriteElContainer = e.spriteEl.querySelector(".react-responsive-spritesheet-container");
                e.spriteElMove = e.spriteElContainer.querySelector(".react-responsive-spritesheet-container__move");
                e.resize(false);
                window.addEventListener("resize", e.resize);
                e.moveImage(false);
                setTimeout(function () {
                  e.resize(false);
                }, 10);
                if (r !== false) {
                  e.play(true);
                }
                var t = e.setInstance();
                i(t);
                s(t);
              }
            };
            c.onerror = function () {
              throw new Error("Failed to load image " + c.src);
            };
          };
          this.resize = function () {
            var t = !(arguments.length > 0) || arguments[0] === undefined || arguments[0];
            var n = e.props;
            var o = n.widthFrame;
            var a = n.onResize;
            if (e.isResponsive) {
              e.spriteScale = e.spriteEl.offsetWidth / o;
              e.spriteElContainer.style.transform = "scale(" + e.spriteScale + ")";
              e.spriteEl.style.height = e.getInfo("height") + "px";
              if (t && a) {
                a(e.setInstance());
              }
            }
          };
          this.play = function (t = false) {
            var n = e.props;
            var o = n.onPlay;
            var a = n.timeout;
            if (!e.isPlaying) {
              setTimeout(function () {
                o(e.setInstance());
                e.setIntervalPlayFunctions();
                e.isPlaying = true;
              }, (() => {
                if (t) {
                  return a;
                } else {
                  return 0;
                }
              })());
            }
          };
          this.setIntervalPlayFunctions = function () {
            if (e.intervalSprite) {
              clearInterval(e.intervalSprite);
            }
            e.intervalSprite = setInterval(function () {
              if (e.isPlaying) {
                e.moveImage();
              }
            }, 1000 / e.fps);
          };
          this.moveImage = function () {
            var t = !(arguments.length > 0) || arguments[0] === undefined || arguments[0];
            var n = e.props;
            var o = n.onEnterFrame;
            var a = n.onEachFrame;
            var r = n.loop;
            var i = n.onLoopComplete;
            var s = Math.floor(e.frame / e.cols);
            var c = e.frame - e.cols * s;
            e.spriteElMove.style.backgroundPosition = "-" + e.props.widthFrame * c + "px -" + e.props.heightFrame * s + "px";
            if (o) {
              o.map(function (t) {
                if (t.frame === e.frame && t.callback) {
                  t.callback();
                }
              });
            }
            if (t) {
              (() => {
                if (e.direction === "rewind") {
                  return e.frame -= 1;
                } else {
                  return e.frame += 1;
                }
              })();
              if (a) {
                a(e.setInstance());
              }
            }
            if (e.isPlaying && (e.direction === "forward" && (e.frame === e.steps || e.frame === e.endAt) || e.direction === "rewind" && (e.frame === -1 || e.frame === e.endAt))) {
              (() => {
                if (r) {
                  if (i) {
                    i(e.setInstance());
                  }
                  e.completeLoopCicles += 1;
                  return e.frame = (() => {
                    if (e.startAt) {
                      return e.startAt;
                    } else {
                      return (() => {
                        if (e.direction === "rewind") {
                          return e.steps - 1;
                        } else {
                          return 0;
                        }
                      })();
                    }
                  })();
                } else {
                  return e.pause();
                }
              })();
            }
          };
          this.pause = function () {
            var t = e.props.onPause;
            e.isPlaying = false;
            clearInterval(e.intervalSprite);
            t(e.setInstance());
          };
          this.goToAndPlay = function (t) {
            e.frame = t || e.frame;
            e.play();
          };
          this.goToAndPause = function (t) {
            e.pause();
            e.frame = t || e.frame;
            e.moveImage();
          };
          this.setStartAt = function (t) {
            e.startAt = (() => {
              if (t) {
                return t - 1;
              } else {
                return 0;
              }
            })();
            return e.startAt;
          };
          this.setEndAt = function (t) {
            e.endAt = t;
            return e.endAt;
          };
          this.setDirection = function (t) {
            e.direction = (() => {
              if (t === "rewind") {
                return "rewind";
              } else {
                return "forward";
              }
            })();
            return e.direction;
          };
          this.getInfo = function (t) {
            switch (t) {
              case "direction":
                return e.direction;
              case "frame":
                return e.frame;
              case "fps":
                return e.fps;
              case "steps":
                return e.steps;
              case "width":
                return e.spriteElContainer.getBoundingClientRect().width;
              case "height":
                return e.spriteElContainer.getBoundingClientRect().height;
              case "scale":
                return e.spriteScale;
              case "isPlaying":
                return e.isPlaying;
              case "isPaused":
                return !e.isPlaying;
              case "completeLoopCicles":
                return e.completeLoopCicles;
              default:
                throw new Error("Invalid param `" + t + "` requested by Spritesheet.getinfo(). See the documentation on https://github.com/danilosetra/react-responsive-spritesheet");
            }
          };
        }
        u.propTypes = {
          className: i.a.string,
          style: i.a.object,
          image: i.a.string.isRequired,
          widthFrame: i.a.number.isRequired,
          heightFrame: i.a.number.isRequired,
          isResponsive: i.a.bool,
          steps: i.a.number.isRequired,
          fps: i.a.number.isRequired,
          direction: i.a.string,
          timeout: i.a.number,
          autoplay: i.a.bool,
          loop: i.a.bool,
          startAt: i.a.number,
          endAt: i.a.oneOfType([i.a.oneOf([false]), i.a.number]),
          background: i.a.string,
          backgroundSize: i.a.string,
          backgroundRepeat: i.a.string,
          backgroundPosition: i.a.string,
          getInstance: i.a.func,
          onClick: i.a.func,
          onDoubleClick: i.a.func,
          onMouseMove: i.a.func,
          onMouseEnter: i.a.func,
          onMouseLeave: i.a.func,
          onMouseOver: i.a.func,
          onMouseOut: i.a.func,
          onMouseDown: i.a.func,
          onMouseUp: i.a.func,
          onInit: i.a.func,
          onResize: i.a.oneOfType([i.a.oneOf([false]), i.a.func]),
          onPlay: i.a.func,
          onPause: i.a.func,
          onLoopComplete: i.a.oneOfType([i.a.oneOf([false]), i.a.func]),
          onEachFrame: i.a.oneOfType([i.a.oneOf([false]), i.a.func]),
          onEnterFrame: i.a.oneOfType([i.a.oneOf([false]), i.a.array])
        };
        u.defaultProps = {
          className: "",
          style: {},
          isResponsive: true,
          direction: "forward",
          timeout: 0,
          autoplay: true,
          loop: false,
          startAt: 0,
          endAt: false,
          background: "",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "",
          getInstance: function () {},
          onClick: function () {},
          onDoubleClick: function () {},
          onMouseMove: function () {},
          onMouseEnter: function () {},
          onMouseLeave: function () {},
          onMouseOver: function () {},
          onMouseOut: function () {},
          onMouseDown: function () {},
          onMouseUp: function () {},
          onInit: function () {},
          onResize: false,
          onPlay: function () {},
          onPause: function () {},
          onLoopComplete: false,
          onEachFrame: false,
          onEnterFrame: false
        };
        t.default = u;
      }, function (e, t, n) {
        e.exports = n(7);
      }]);
    }