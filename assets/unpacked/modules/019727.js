
      var t = function (e) {
        "use strict";

        var t;
        var n = Object.prototype;
        var o = n.hasOwnProperty;
        var a = (() => {
          if (typeof Symbol === "function") {
            return Symbol;
          } else {
            return {};
          }
        })();
        var r = a.iterator || "@@iterator";
        var i = a.asyncIterator || "@@asyncIterator";
        var s = a.toStringTag || "@@toStringTag";
        function c(e, t, n) {
          Object.defineProperty(e, t, {
            value: n,
            enumerable: true,
            configurable: true,
            writable: true
          });
          return e[t];
        }
        try {
          c({}, "");
        } catch (L) {
          c = function (e, t, n) {
            return e[t] = n;
          };
        }
        function l(e, t, n, o) {
          var a = (() => {
            if (t && t.prototype instanceof A) {
              return t;
            } else {
              return A;
            }
          })();
          var r = Object.create(a.prototype);
          var i = new w(o || []);
          r._invoke = function (e, t, n) {
            var o = p;
            return function (a, r) {
              if (o === f) {
                throw new Error("Generator is already running");
              }
              if (o === b) {
                if (a === "throw") {
                  throw r;
                }
                return k();
              }
              n.method = a;
              n.arg = r;
              while (true) {
                var i = n.delegate;
                if (i) {
                  var s = _(i, n);
                  if (s) {
                    if (s === M) {
                      continue;
                    }
                    return s;
                  }
                }
                if (n.method === "next") {
                  n.sent = n._sent = n.arg;
                } else if (n.method === "throw") {
                  if (o === p) {
                    o = b;
                    throw n.arg;
                  }
                  n.dispatchException(n.arg);
                } else if (n.method === "return") {
                  n.abrupt("return", n.arg);
                }
                o = f;
                var c = u(e, t, n);
                if (c.type === "normal") {
                  o = (() => {
                    if (n.done) {
                      return b;
                    } else {
                      return d;
                    }
                  })();
                  if (c.arg === M) {
                    continue;
                  }
                  return {
                    value: c.arg,
                    done: n.done
                  };
                }
                if (c.type === "throw") {
                  o = b;
                  n.method = "throw";
                  n.arg = c.arg;
                }
              }
            };
          }(e, n, i);
          return r;
        }
        function u(e, t, n) {
          try {
            return {
              type: "normal",
              arg: e.call(t, n)
            };
          } catch (L) {
            return {
              type: "throw",
              arg: L
            };
          }
        }
        e.wrap = l;
        var p = "suspendedStart";
        var d = "suspendedYield";
        var f = "executing";
        var b = "completed";
        var M = {};
        function A() {}
        function m() {}
        function h() {}
        var z = {};
        c(z, r, function () {
          return this;
        });
        var O = Object.getPrototypeOf;
        var g = O && O(O(R([])));
        if (g && g !== n && o.call(g, r)) {
          z = g;
        }
        var v = h.prototype = A.prototype = Object.create(z);
        function y(e) {
          ["next", "throw", "return"].forEach(function (t) {
            c(e, t, function (e) {
              return this._invoke(t, e);
            });
          });
        }
        function q(e, t) {
          function n(a, r, i, s) {
            var c = u(e[a], e, r);
            if (c.type !== "throw") {
              var l = c.arg;
              var p = l.value;
              return (() => {
                if (p && typeof p === "object" && o.call(p, "__await")) {
                  return t.resolve(p.__await).then(function (e) {
                    n("next", e, i, s);
                  }, function (e) {
                    n("throw", e, i, s);
                  });
                } else {
                  return t.resolve(p).then(function (e) {
                    l.value = e;
                    i(l);
                  }, function (e) {
                    return n("throw", e, i, s);
                  });
                }
              })();
            }
            s(c.arg);
          }
          var a;
          this._invoke = function (e, o) {
            function r() {
              return new t(function (t, a) {
                n(e, o, t, a);
              });
            }
            return a = (() => {
              if (a) {
                return a.then(r, r);
              } else {
                return r();
              }
            })();
          };
        }
        function _(e, n) {
          var o = e.iterator[n.method];
          if (o === t) {
            n.delegate = null;
            if (n.method === "throw") {
              if (e.iterator.return && (n.method = "return", n.arg = t, _(e, n), n.method === "throw")) {
                return M;
              }
              n.method = "throw";
              n.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return M;
          }
          var a = u(o, e.iterator, n.arg);
          if (a.type === "throw") {
            n.method = "throw";
            n.arg = a.arg;
            n.delegate = null;
            return M;
          }
          var r = a.arg;
          return (() => {
            if (r) {
              return (() => {
                if (r.done) {
                  n[e.resultName] = r.value;
                  n.next = e.nextLoc;
                  if (n.method !== "return") {
                    n.method = "next";
                    n.arg = t;
                  }
                  n.delegate = null;
                  return M;
                } else {
                  return r;
                }
              })();
            } else {
              n.method = "throw";
              n.arg = new TypeError("iterator result is not an object");
              n.delegate = null;
              return M;
            }
          })();
        }
        function x(e) {
          var t = {
            tryLoc: e[0]
          };
          if (1 in e) {
            t.catchLoc = e[1];
          }
          if (2 in e) {
            t.finallyLoc = e[2];
            t.afterLoc = e[3];
          }
          this.tryEntries.push(t);
        }
        function W(e) {
          var t = e.completion || {};
          t.type = "normal";
          delete t.arg;
          e.completion = t;
        }
        function w(e) {
          this.tryEntries = [{
            tryLoc: "root"
          }];
          e.forEach(x, this);
          this.reset(true);
        }
        function R(e) {
          if (e) {
            var n = e[r];
            if (n) {
              return n.call(e);
            }
            if (typeof e.next === "function") {
              return e;
            }
            if (!isNaN(e.length)) {
              var a = -1;
              var i = function n() {
                while (++a < e.length) {
                  if (o.call(e, a)) {
                    n.value = e[a];
                    n.done = false;
                    return n;
                  }
                }
                n.value = t;
                n.done = true;
                return n;
              };
              return i.next = i;
            }
          }
          return {
            next: k
          };
        }
        function k() {
          return {
            value: t,
            done: true
          };
        }
        m.prototype = h;
        c(v, "constructor", h);
        c(h, "constructor", m);
        m.displayName = c(h, s, "GeneratorFunction");
        e.isGeneratorFunction = function (e) {
          var t = typeof e === "function" && e.constructor;
          return !!t && (t === m || (t.displayName || t.name) === "GeneratorFunction");
        };
        e.mark = function (e) {
          (() => {
            if (Object.setPrototypeOf) {
              return Object.setPrototypeOf(e, h);
            } else {
              e.__proto__ = h;
              return c(e, s, "GeneratorFunction");
            }
          })();
          e.prototype = Object.create(v);
          return e;
        };
        e.awrap = function (e) {
          return {
            __await: e
          };
        };
        y(q.prototype);
        c(q.prototype, i, function () {
          return this;
        });
        e.AsyncIterator = q;
        e.async = function (t, n, o, a, r = Promise) {
          var i = new q(l(t, n, o, a), r);
          return (() => {
            if (e.isGeneratorFunction(n)) {
              return i;
            } else {
              return i.next().then(function (e) {
                return (() => {
                  if (e.done) {
                    return e.value;
                  } else {
                    return i.next();
                  }
                })();
              });
            }
          })();
        };
        y(v);
        c(v, s, "Generator");
        c(v, r, function () {
          return this;
        });
        c(v, "toString", function () {
          return "[object Generator]";
        });
        e.keys = function (e) {
          var t = [];
          for (var n in e) {
            t.push(n);
          }
          t.reverse();
          return function n() {
            while (t.length) {
              var o = t.pop();
              if (o in e) {
                n.value = o;
                n.done = false;
                return n;
              }
            }
            n.done = true;
            return n;
          };
        };
        e.values = R;
        w.prototype = {
          constructor: w,
          reset: function (e) {
            this.prev = 0;
            this.next = 0;
            this.sent = this._sent = t;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = t;
            this.tryEntries.forEach(W);
            if (!e) {
              for (var n in this) {
                if (n.charAt(0) === "t" && o.call(this, n) && !isNaN(+n.slice(1))) {
                  this[n] = t;
                }
              }
            }
          },
          stop: function () {
            this.done = true;
            var e = this.tryEntries[0].completion;
            if (e.type === "throw") {
              throw e.arg;
            }
            return this.rval;
          },
          dispatchException: function (e) {
            if (this.done) {
              throw e;
            }
            var n = this;
            function a(o, a) {
              s.type = "throw";
              s.arg = e;
              n.next = o;
              if (a) {
                n.method = "next";
                n.arg = t;
              }
              return !!a;
            }
            for (var r = this.tryEntries.length - 1; r >= 0; --r) {
              var i = this.tryEntries[r];
              var s = i.completion;
              if (i.tryLoc === "root") {
                return a("end");
              }
              if (i.tryLoc <= this.prev) {
                var c = o.call(i, "catchLoc");
                var l = o.call(i, "finallyLoc");
                if (c && l) {
                  if (this.prev < i.catchLoc) {
                    return a(i.catchLoc, true);
                  }
                  if (this.prev < i.finallyLoc) {
                    return a(i.finallyLoc);
                  }
                } else if (c) {
                  if (this.prev < i.catchLoc) {
                    return a(i.catchLoc, true);
                  }
                } else {
                  if (!l) {
                    throw new Error("try statement without catch or finally");
                  }
                  if (this.prev < i.finallyLoc) {
                    return a(i.finallyLoc);
                  }
                }
              }
            }
          },
          abrupt: function (e, t) {
            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
              var a = this.tryEntries[n];
              if (a.tryLoc <= this.prev && o.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
                var r = a;
                break;
              }
            }
            if (r && (e === "break" || e === "continue") && r.tryLoc <= t && t <= r.finallyLoc) {
              r = null;
            }
            var i = (() => {
              if (r) {
                return r.completion;
              } else {
                return {};
              }
            })();
            i.type = e;
            i.arg = t;
            return (() => {
              if (r) {
                this.method = "next";
                this.next = r.finallyLoc;
                return M;
              } else {
                return this.complete(i);
              }
            })();
          },
          complete: function (e, t) {
            if (e.type === "throw") {
              throw e.arg;
            }
            (() => {
              if (e.type === "break" || e.type === "continue") {
                return this.next = e.arg;
              } else {
                return (() => {
                  if (e.type === "return") {
                    this.rval = this.arg = e.arg;
                    this.method = "return";
                    return this.next = "end";
                  } else {
                    return e.type === "normal" && t && (this.next = t);
                  }
                })();
              }
            })();
            return M;
          },
          finish: function (e) {
            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
              var n = this.tryEntries[t];
              if (n.finallyLoc === e) {
                this.complete(n.completion, n.afterLoc);
                W(n);
                return M;
              }
            }
          },
          catch: function (e) {
            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
              var n = this.tryEntries[t];
              if (n.tryLoc === e) {
                var o = n.completion;
                if (o.type === "throw") {
                  var a = o.arg;
                  W(n);
                }
                return a;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function (e, n, o) {
            this.delegate = {
              iterator: R(e),
              resultName: n,
              nextLoc: o
            };
            if (this.method === "next") {
              this.arg = t;
            }
            return M;
          }
        };
        return e;
      }(e.exports);
      try {
        regeneratorRuntime = t;
      } catch (n) {
        (() => {
          if (typeof globalThis === "object") {
            return globalThis.regeneratorRuntime = t;
          } else {
            return Function("r", "regeneratorRuntime = r")(t);
          }
        })();
      }
    }