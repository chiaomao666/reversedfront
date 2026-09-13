
      "use strict";

      var o = n(34575).default;
      var a = n(93913).default;
      var r = n(2205).default;
      var i = n(99842).default;
      n(81740);
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.default = undefined;
      n(74093);
      var s;
      var c = function (e, t) {
        if (!t && e && e.__esModule) {
          return e;
        }
        if (e === null || typeof e !== "object" && typeof e !== "function") {
          return {
            default: e
          };
        }
        var n = u(t);
        if (n && n.has(e)) {
          return n.get(e);
        }
        var o = {};
        var a = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var r in e) {
          if (r !== "default" && Object.prototype.hasOwnProperty.call(e, r)) {
            var i = (() => {
              if (a) {
                return Object.getOwnPropertyDescriptor(e, r);
              } else {
                return null;
              }
            })();
            (() => {
              if (i && (i.get || i.set)) {
                return Object.defineProperty(o, r, i);
              } else {
                return o[r] = e[r];
              }
            })();
          }
        }
        o.default = e;
        if (n) {
          n.set(e, o);
        }
        return o;
      }(n(72791));
      var l = (() => {
        if ((s = n(28182)) && s.__esModule) {
          return s;
        } else {
          return {
            default: s
          };
        }
      })();
      function u(e) {
        if (typeof WeakMap !== "function") {
          return null;
        }
        var t = new WeakMap();
        var n = new WeakMap();
        return (u = function (e) {
          return (() => {
            if (e) {
              return n;
            } else {
              return t;
            }
          })();
        })(e);
      }
      var p = Math.abs;
      var d = parseFloat;
      var f = "min";
      var b = "max";
      var M = "any";
      var A = "vertical";
      var m = "tabindex";
      var h = "data-lower";
      var z = "data-upper";
      var O = "data-active";
      var g = "data-vertical";
      var v = "data-disabled";
      var y = function (e) {
        r(n, e);
        var t = i(n);
        function n() {
          var e;
          o(this, n);
          (e = t.call(this)).element = (0, c.createRef)();
          e.input = [(0, c.createRef)(), (0, c.createRef)()];
          e.thumb = [(0, c.createRef)(), (0, c.createRef)()];
          e.range = (0, c.createRef)();
          e.options = {};
          e.firstCall = true;
          e.isControlled = false;
          e.externalInput = false;
          e.isComponentMounted = false;
          e.lastValueProp = [];
          return e;
        }
        a(n, [{
          key: "componentDidMount",
          value: function () {
            var e = this;
            if (!this.isComponentMounted) {
              this.value = this.setMinMaxProps();
              this.index = this.setMinMaxProps(0, 1);
              this.thumbWidth = this.setMinMaxProps();
              this.thumbHeight = this.setMinMaxProps();
              this.rangeLimits = this.setMinMaxProps();
              this.sliderValue = this.setMinMaxProps();
              this.maxRangeWidth = 0;
              this.rangeWidth = 0;
              this.isDragging = false;
              this.thumbDrag = false;
              this.startPos = 0;
              this.reset();
              this.addNodeEventListener(this.element.current, "pointerdown", function (t) {
                e.elementFocused(t);
              });
              this.thumb.forEach(function (t, n) {
                e.addNodeEventListener(t.current, "pointerdown", function (o) {
                  e.initiateThumbDrag(o, n, t.current);
                });
                e.addNodeEventListener(t.current, "keydown", function (t) {
                  if (t.which >= 37 && t.which <= 40) {
                    t.preventDefault();
                    e.stepValue(n, t.which);
                  }
                });
              });
              this.addNodeEventListener(this.range.current, "pointerdown", function (t) {
                e.initiateRangeDrag(t);
              });
              this.pointerMoveEvent = function (t) {
                e.drag(t);
              };
              this.pointerUpEvent = function () {
                if (e.isDragging) {
                  e.removeNodeAttribute(e.thumb[0].current, O);
                  e.removeNodeAttribute(e.thumb[1].current, O);
                  e.removeNodeAttribute(e.range.current, O);
                  e.isDragging = false;
                  (() => {
                    if (e.thumbDrag) {
                      return e.options.onThumbDragEnd && e.options.onThumbDragEnd();
                    } else {
                      return e.options.onRangeDragEnd && e.options.onRangeDragEnd();
                    }
                  })();
                }
              };
              this.resizeEvent = function () {
                e.syncThumbDimensions();
                e.updateThumbs();
                e.updateRange();
              };
              this.addNodeEventListener(document, "pointermove", this.pointerMoveEvent);
              this.addNodeEventListener(document, "pointerup", this.pointerUpEvent);
              this.addNodeEventListener(window, "resize", this.resizeEvent);
              this.isComponentMounted = true;
            }
          }
        }, {
          key: "componentDidUpdate",
          value: function () {
            this.reset();
          }
        }, {
          key: "componentWillUnmount",
          value: function () {
            this.removeNodeEventListener(document, "pointermove", this.pointerMoveEvent);
            this.removeNodeEventListener(document, "pointerup", this.pointerUpEvent);
            this.removeNodeEventListener(window, "resize", this.resizeEvent);
            this.isComponentMounted = false;
          }
        }, {
          key: "reset",
          value: function () {
            this.isControlled = !!this.props.value;
            if (this.isControlled) {
              if (this.firstCall || this.props.value !== this.lastValueProp) {
                this.firstCall = false;
                this.externalInput = true;
              }
              this.lastValueProp = this.props.value;
            }
            this.maxRangeWidth = this.options.max - this.options.min;
            this.updateOrientation();
            this.setValue("", true, false);
            this.updateRangeLimits();
            this.updateDisabledState();
            this.updateThumbsDisabledState();
            this.updateTabIndexes();
          }
        }, {
          key: "isNumber",
          value: function (e) {
            return !isNaN(e) && +e + "" === e + "";
          }
        }, {
          key: "setMinMaxProps",
          value: function () {
            var e = (() => {
              if (arguments.length > 0 && arguments[0] !== undefined) {
                return arguments[0];
              } else {
                return 0;
              }
            })();
            var t = (() => {
              if (arguments.length > 1 && arguments[1] !== undefined) {
                return arguments[1];
              } else {
                return 0;
              }
            })();
            return {
              min: e,
              max: t
            };
          }
        }, {
          key: "iterateMinMaxProps",
          value: function (e) {
            [f, b].forEach(e);
          }
        }, {
          key: "getSetProps",
          value: function (e, t, n) {
            if (e) {
              return t;
            }
            n();
          }
        }, {
          key: "setNodeAttribute",
          value: function (e, t) {
            var n = (() => {
              if (arguments.length > 2 && arguments[2] !== undefined) {
                return arguments[2];
              } else {
                return "";
              }
            })();
            e.setAttribute(t, n);
          }
        }, {
          key: "removeNodeAttribute",
          value: function (e, t) {
            e.removeAttribute(t);
          }
        }, {
          key: "addNodeEventListener",
          value: function (e, t, n) {
            var o = !(arguments.length > 3) || arguments[3] === undefined || arguments[3];
            e.addEventListener(t, n, (() => {
              if (o) {
                return {
                  passive: false,
                  capture: true
                };
              } else {
                return {};
              }
            })());
          }
        }, {
          key: "removeNodeEventListener",
          value: function (e, t, n) {
            var o = !(arguments.length > 3) || arguments[3] === undefined || arguments[3];
            e.removeEventListener(t, n, (() => {
              if (o) {
                return {
                  passive: false,
                  capture: true
                };
              } else {
                return {};
              }
            })());
          }
        }, {
          key: "fallbackToDefault",
          value: function (e, t) {
            this.options[e] = (() => {
              if (this.props[e]) {
                return this.props[e];
              } else {
                return t;
              }
            })();
          }
        }, {
          key: "ifVerticalElse",
          value: function (e, t) {
            return (() => {
              if (this.options.orientation === A) {
                return e;
              } else {
                return t;
              }
            })();
          }
        }, {
          key: "currentIndex",
          value: function (e) {
            return (() => {
              if (e === 1) {
                return this.index.max;
              } else {
                return this.index.min;
              }
            })();
          }
        }, {
          key: "safeMinMaxValues",
          value: function () {
            var e = false;
            if (!this.isNumber(this.options.min) || !this.isNumber(this.options.max)) {
              e = true;
            }
            this.options.min = (() => {
              if (e) {
                return 1;
              } else {
                return +this.options.min;
              }
            })();
            this.options.max = (() => {
              if (e) {
                return 1;
              } else {
                return +this.options.max;
              }
            })();
          }
        }, {
          key: "safeThumbsDisabledValues",
          value: function () {
            (() => {
              if (this.options.thumbsDisabled instanceof Array) {
                if (this.options.thumbsDisabled.length === 1) {
                  this.options.thumbsDisabled.push(false);
                }
                return this.options.thumbsDisabled.length !== 1 && this.options.thumbsDisabled.length !== 2 && (this.options.thumbsDisabled = [false, false]);
              } else {
                return this.options.thumbsDisabled = [this.options.thumbsDisabled, this.options.thumbsDisabled];
              }
            })();
            this.options.thumbsDisabled[0] = !!this.options.thumbsDisabled[0];
            this.options.thumbsDisabled[1] = !!this.options.thumbsDisabled[1];
          }
        }, {
          key: "setValue",
          value: function (e, t = false) {
            var n = !(arguments.length > 2) || arguments[2] === undefined || arguments[2];
            var o = this.setMinMaxProps(this.input[0].current.value, this.input[1].current.value);
            e = e || o;
            this.input[this.index.min].current.value = e.min;
            this.input[this.index.max].current.value = (() => {
              if (this.thumbDrag || t) {
                return e.max;
              } else {
                return e.min + this.rangeWidth;
              }
            })();
            this.syncValues();
            if (this.value.min > this.value.max) {
              this.index.min = +!this.index.min;
              this.index.max = +!this.index.max;
              this.removeNodeAttribute(this.thumb[this.index.min].current, z);
              this.removeNodeAttribute(this.thumb[this.index.max].current, h);
              this.setNodeAttribute(this.thumb[this.index.min].current, h);
              this.setNodeAttribute(this.thumb[this.index.max].current, z);
              this.thumbDrag &&= (() => {
                if (this.thumbDrag === f) {
                  return b;
                } else {
                  return f;
                }
              })();
              this.syncValues();
            }
            this.sliderValue = (() => {
              if (t) {
                return this.value;
              } else {
                return e;
              }
            })();
            var a = false;
            if (o.min !== this.input[0].current.value || t) {
              a = true;
            }
            if (o.max !== this.input[1].current.value || t) {
              a = true;
            }
            if (a) {
              if (n && this.options.onInput) {
                this.options.onInput([this.value.min, this.value.max]);
              }
              if (!this.isControlled || !!this.externalInput) {
                this.externalInput = false;
                this.syncThumbDimensions();
                this.updateThumbs();
                this.updateRange();
                this.updateAriaValueAttributes();
              }
            }
          }
        }, {
          key: "syncValues",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t) {
              e.value[t] = +e.input[e.index[t]].current.value;
            });
          }
        }, {
          key: "updateThumbs",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t) {
              e.thumb[e.index[t]].current.style[e.ifVerticalElse("top", "left")] = `calc(${(e.value[t] - e.options.min) / e.maxRangeWidth * 100}% + ${(0.5 - (e.value[t] - e.options.min) / e.maxRangeWidth) * e.ifVerticalElse(e.thumbHeight, e.thumbWidth)[t]}px)`;
            });
          }
        }, {
          key: "updateRange",
          value: function () {
            var e = this.element.current.getBoundingClientRect();
            var t = (0.5 - (this.value.min - this.options.min) / this.maxRangeWidth) * this.ifVerticalElse(this.thumbHeight, this.thumbWidth).min / this.ifVerticalElse(e.bottom - e.top, e.right - e.left);
            var n = (0.5 - (this.value.max - this.options.min) / this.maxRangeWidth) * this.ifVerticalElse(this.thumbHeight, this.thumbWidth).max / this.ifVerticalElse(e.bottom - e.top, e.right - e.left);
            this.range.current.style[this.ifVerticalElse("top", "left")] = `${((this.value.min - this.options.min) / this.maxRangeWidth + t) * 100}%`;
            this.range.current.style[this.ifVerticalElse("height", "width")] = `${((this.value.max - this.options.min) / this.maxRangeWidth - (this.value.min - this.options.min) / this.maxRangeWidth - t + n) * 100}%`;
          }
        }, {
          key: "updateRangeLimits",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t, n) {
              e.rangeLimits[t] = (() => {
                if (e.options.thumbsDisabled[n]) {
                  return e.value[t];
                } else {
                  return e.options[t];
                }
              })();
            });
          }
        }, {
          key: "updateTabIndexes",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t, n) {
              (() => {
                if (e.options.disabled || e.options.thumbsDisabled[n]) {
                  return e.removeNodeAttribute(e.thumb[e.currentIndex(n)].current, m);
                } else {
                  return e.setNodeAttribute(e.thumb[e.currentIndex(n)].current, m, 0);
                }
              })();
            });
          }
        }, {
          key: "updateAriaValueAttributes",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t) {
              e.setNodeAttribute(e.thumb[e.index[t]].current, "aria-valuemin", e.options.min);
              e.setNodeAttribute(e.thumb[e.index[t]].current, "aria-valuemax", e.options.max);
              e.setNodeAttribute(e.thumb[e.index[t]].current, "aria-valuenow", e.value[t]);
              e.setNodeAttribute(e.thumb[e.index[t]].current, "aria-valuetext", e.value[t]);
            });
          }
        }, {
          key: "updateDisabledState",
          value: function () {
            (() => {
              if (this.options.disabled) {
                return this.setNodeAttribute(this.element.current, v);
              } else {
                return this.removeNodeAttribute(this.element.current, v);
              }
            })();
          }
        }, {
          key: "updateThumbsDisabledState",
          value: function () {
            var e = this;
            this.options.thumbsDisabled.forEach(function (t, n) {
              var o = e.currentIndex(n);
              (() => {
                if (t) {
                  e.setNodeAttribute(e.thumb[o].current, v);
                  return e.setNodeAttribute(e.thumb[o].current, "aria-disabled", true);
                } else {
                  e.removeNodeAttribute(e.thumb[o].current, v);
                  return e.setNodeAttribute(e.thumb[o].current, "aria-disabled", false);
                }
              })();
            });
          }
        }, {
          key: "updateLimits",
          value: function (e) {
            var t = this;
            var n = arguments.length > 1 && arguments[1] !== undefined && arguments[1];
            this.options[e] = n;
            this.safeMinMaxValues();
            this.iterateMinMaxProps(function (e) {
              t.input[0].current[e] = t.options[e];
              t.input[1].current[e] = t.options[e];
            });
            this.maxRangeWidth = this.options.max - this.options.min;
            this.setValue("", true);
            this.updateRangeLimits();
          }
        }, {
          key: "updateOrientation",
          value: function () {
            (() => {
              if (this.options.orientation === A) {
                return this.setNodeAttribute(this.element.current, g);
              } else {
                return this.removeNodeAttribute(this.element.current, g);
              }
            })();
            this.range.current.style[this.ifVerticalElse("left", "top")] = "";
            this.range.current.style[this.ifVerticalElse("width", "height")] = "";
            this.thumb[0].current.style[this.ifVerticalElse("left", "top")] = "";
            this.thumb[1].current.style[this.ifVerticalElse("left", "top")] = "";
          }
        }, {
          key: "syncThumbDimensions",
          value: function () {
            var e = this;
            this.iterateMinMaxProps(function (t) {
              e.thumbWidth[t] = d(window.getComputedStyle(e.thumb[e.index[t]].current).width);
              e.thumbHeight[t] = d(window.getComputedStyle(e.thumb[e.index[t]].current).height);
            });
          }
        }, {
          key: "currentPosition",
          value: function (e, t) {
            var n = this.element.current.getBoundingClientRect();
            var o = t.getBoundingClientRect();
            var a = (this.ifVerticalElse(o.top - n.top, o.left - n.left) + (e[`client${this.ifVerticalElse("Y", "X")}`] - t.getBoundingClientRect()[this.ifVerticalElse("top", "left")]) - (() => {
              if (this.thumbDrag) {
                return (0.5 - (this.value[this.thumbDrag] - this.options.min) / this.maxRangeWidth) * this.ifVerticalElse(this.thumbHeight, this.thumbWidth)[this.thumbDrag];
              } else {
                return 0;
              }
            })()) / this.ifVerticalElse(n.bottom - n.top, n.right - n.left) * this.maxRangeWidth + this.options.min;
            return (() => {
              if (a < this.options.min) {
                return this.options.min;
              } else {
                return (() => {
                  if (a > this.options.max) {
                    return this.options.max;
                  } else {
                    return a;
                  }
                })();
              }
            })();
          }
        }, {
          key: "doesntHaveClassName",
          value: function (e, t) {
            return !e.target.classList.contains(t);
          }
        }, {
          key: "elementFocused",
          value: function (e) {
            var t = !(arguments.length > 1) || arguments[1] === undefined || arguments[1];
            var n = false;
            if (!this.options.disabled && (this.doesntHaveClassName(e, "range-slider__thumb") && this.doesntHaveClassName(e, "range-slider__range") || this.options.rangeSlideDisabled && this.doesntHaveClassName(e, "range-slider__thumb"))) {
              n = true;
            }
            if (n && this.options.thumbsDisabled[0] && this.options.thumbsDisabled[1]) {
              n = false;
            }
            if (n) {
              var o = this.currentPosition(e, this.range.current);
              var a = p(this.value.min - o);
              var r = p(this.value.max - o);
              if (this.options.thumbsDisabled[0]) {
                if (o >= this.value.min) {
                  this.setValue(this.setMinMaxProps(this.value.min, o), true, !t);
                  this.initiateThumbDrag(e, this.index.max, this.thumb[this.index.max].current, !t);
                }
              } else if (this.options.thumbsDisabled[1]) {
                if (o <= this.value.max) {
                  this.setValue(this.setMinMaxProps(o, this.value.max), true, !t);
                  this.initiateThumbDrag(e, this.index.min, this.thumb[this.index.min].current, !t);
                }
              } else {
                var i = this.index.max;
                (() => {
                  if (a === r) {
                    return this.setValue(this.setMinMaxProps(this.value.min, o), true, !t);
                  } else {
                    this.setValue(this.setMinMaxProps((() => {
                      if (a < r) {
                        return o;
                      } else {
                        return this.value.min;
                      }
                    })(), (() => {
                      if (r < a) {
                        return o;
                      } else {
                        return this.value.max;
                      }
                    })()), true, !t);
                    return i = (() => {
                      if (a < r) {
                        return this.index.min;
                      } else {
                        return this.index.max;
                      }
                    })();
                  }
                })();
                this.initiateThumbDrag(e, i, this.thumb[i].current, !t);
              }
              if (t) {
                this.elementFocused(e, false);
              }
            }
          }
        }, {
          key: "initiateDrag",
          value: function (e, t) {
            this.syncThumbDimensions();
            this.setNodeAttribute(t, O);
            this.startPos = this.currentPosition(e, t);
            this.isDragging = true;
          }
        }, {
          key: "initiateThumbDrag",
          value: function (e, t, n) {
            var o = !(arguments.length > 3) || arguments[3] === undefined || arguments[3];
            if (!this.options.disabled && !this.options.thumbsDisabled[this.currentIndex(t)]) {
              this.initiateDrag(e, n);
              this.thumbDrag = (() => {
                if (this.index.min === t) {
                  return f;
                } else {
                  return b;
                }
              })();
              if (o && this.options.onThumbDragStart) {
                this.options.onThumbDragStart();
              }
            }
          }
        }, {
          key: "initiateRangeDrag",
          value: function (e) {
            if (!this.options.disabled && !this.options.rangeSlideDisabled) {
              this.initiateDrag(e, this.range.current);
              this.rangeWidth = this.value.max - this.value.min;
              this.thumbDrag = false;
              if (this.options.onRangeDragStart) {
                this.options.onRangeDragStart();
              }
            }
          }
        }, {
          key: "drag",
          value: function (e) {
            if (this.isDragging) {
              var t = this.currentPosition(e, this.range.current);
              var n = t - this.startPos;
              var o = this.value.min;
              var a = this.value.max;
              var r = (() => {
                if (this.thumbDrag) {
                  return this.rangeLimits.min;
                } else {
                  return this.options.min;
                }
              })();
              var i = (() => {
                if (this.thumbDrag) {
                  return this.rangeLimits.max;
                } else {
                  return this.options.max;
                }
              })();
              if (!this.thumbDrag || this.thumbDrag === f) {
                o = (() => {
                  if (this.thumbDrag) {
                    return t;
                  } else {
                    return this.sliderValue.min + n;
                  }
                })();
              }
              if (!this.thumbDrag || this.thumbDrag === b) {
                a = (() => {
                  if (this.thumbDrag) {
                    return t;
                  } else {
                    return this.sliderValue.max + n;
                  }
                })();
              }
              (() => {
                if (o >= r && o <= i && a >= r && a <= i) {
                  this.setValue({
                    min: o,
                    max: a
                  });
                  return this.startPos = t;
                } else {
                  if (o > i && this.thumbDrag) {
                    this.setValue(this.setMinMaxProps(i, i));
                    this.startPos = t;
                  }
                  if (a < r && this.thumbDrag) {
                    this.setValue(this.setMinMaxProps(r, r));
                    this.startPos = t;
                  }
                  if (o < r) {
                    (() => {
                      if (this.thumbDrag) {
                        return this.setValue(this.setMinMaxProps(r, this.value.max));
                      } else {
                        return this.setValue(this.setMinMaxProps(r, this.value.max - this.value.min + r));
                      }
                    })();
                    this.startPos = t;
                  }
                  return a > i && ((() => {
                    if (this.thumbDrag) {
                      return this.setValue(this.setMinMaxProps(this.value.min, i));
                    } else {
                      return this.setValue(this.setMinMaxProps(this.value.min - this.value.max + i, i));
                    }
                  })(), this.startPos = t);
                }
              })();
              if (!this.thumbDrag) {
                this.updateRangeLimits();
              }
            }
          }
        }, {
          key: "actualStepValue",
          value: function () {
            var e = d(this.input[0].current.step);
            return (() => {
              if (this.input[0].current.step === M) {
                return M;
              } else {
                return (() => {
                  if (e === 0 || isNaN(e)) {
                    return 1;
                  } else {
                    return e;
                  }
                })();
              }
            })();
          }
        }, {
          key: "stepValue",
          value: function (e, t) {
            var n = (() => {
              if (t === 37 || t === 40) {
                return -1;
              } else {
                return 1;
              }
            })() * this.ifVerticalElse(-1, 1);
            if (!this.options.disabled && !this.options.thumbsDisabled[this.currentIndex(e)]) {
              var o = this.actualStepValue();
              o = (() => {
                if (o === M) {
                  return 1;
                } else {
                  return o;
                }
              })();
              var a = this.value.min + o * (() => {
                if (this.index.min === e) {
                  return n;
                } else {
                  return 0;
                }
              })();
              var r = this.value.max + o * (() => {
                if (this.index.max === e) {
                  return n;
                } else {
                  return 0;
                }
              })();
              if (a > this.rangeLimits.max) {
                a = this.rangeLimits.max;
              }
              if (r < this.rangeLimits.min) {
                r = this.rangeLimits.min;
              }
              this.setValue({
                min: a,
                max: r
              }, true);
            }
          }
        }, {
          key: "render",
          value: function () {
            this.fallbackToDefault("rangeSlideDisabled", false);
            this.fallbackToDefault("thumbsDisabled", [false, false]);
            this.fallbackToDefault("orientation", "horizontal");
            this.fallbackToDefault("defaultValue", [25, 75]);
            this.fallbackToDefault("disabled", false);
            this.fallbackToDefault("onThumbDragStart", false);
            this.fallbackToDefault("onRangeDragStart", false);
            this.fallbackToDefault("onThumbDragEnd", false);
            this.fallbackToDefault("onRangeDragEnd", false);
            this.fallbackToDefault("onInput", false);
            this.fallbackToDefault("step", 1);
            this.fallbackToDefault("min", 0);
            this.fallbackToDefault("max", 100);
            if (this.props.value) {
              this.fallbackToDefault("value", [25, 75]);
            }
            this.safeMinMaxValues();
            this.safeThumbsDisabledValues();
            return c.default.createElement("div", {
              "data-testid": "element",
              id: this.props.id,
              ref: this.element,
              className: (0, l.default)("range-slider", this.props.className)
            }, c.default.createElement("input", {
              ref: this.input[0],
              type: "range",
              min: this.options.min,
              max: this.options.max,
              step: this.options.step,
              value: (() => {
                if (this.props.value) {
                  return this.options.value[0];
                } else {
                  return (() => {
                    if (this.isComponentMounted) {
                      return this.value.min;
                    } else {
                      return this.options.defaultValue[0];
                    }
                  })();
                }
              })(),
              onChange: function () {},
              disabled: true
            }), c.default.createElement("input", {
              ref: this.input[1],
              type: "range",
              min: this.options.min,
              max: this.options.max,
              step: this.options.step,
              value: (() => {
                if (this.props.value) {
                  return this.options.value[1];
                } else {
                  return (() => {
                    if (this.isComponentMounted) {
                      return this.value.max;
                    } else {
                      return this.options.defaultValue[1];
                    }
                  })();
                }
              })(),
              onChange: function () {},
              disabled: true
            }), c.default.createElement("div", {
              ref: this.thumb[0],
              role: "slider",
              className: "range-slider__thumb",
              "data-lower": true
            }), c.default.createElement("div", {
              ref: this.thumb[1],
              role: "slider",
              className: "range-slider__thumb",
              "data-upper": true
            }), c.default.createElement("div", {
              ref: this.range,
              className: "range-slider__range"
            }));
          }
        }]);
        return n;
      }(c.PureComponent);
      var q = y;
      t.default = q;
    }