if (typeof window !== 'undefined') {
  !(function (t, e) {
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = e())
      : 'function' == typeof define && define.amd
      ? define(e)
      : ((t = 'undefined' != typeof globalThis ? globalThis : t || self)[
          'polyfills-module'
        ] = e());
  })(this, function () {
    'use strict';
    var t,
      e =
        'undefined' != typeof globalThis
          ? globalThis
          : 'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
          ? self
          : {};
    !(function () {
      if ('object' == typeof window)
        if (
          'IntersectionObserver' in window &&
          'IntersectionObserverEntry' in window &&
          'intersectionRatio' in window.IntersectionObserverEntry.prototype
        )
          'isIntersecting' in window.IntersectionObserverEntry.prototype ||
            Object.defineProperty(
              window.IntersectionObserverEntry.prototype,
              'isIntersecting',
              {
                get: function () {
                  return this.intersectionRatio > 0;
                },
              }
            );
        else {
          var t = (function (t) {
              for (var e = window.document, n = r(e); n; )
                n = r((e = n.ownerDocument));
              return e;
            })(),
            e = [],
            n = null,
            o = null;
          (s.prototype.THROTTLE_TIMEOUT = 100),
            (s.prototype.POLL_INTERVAL = null),
            (s.prototype.USE_MUTATION_OBSERVER = !0),
            (s._setupCrossOriginUpdater = function () {
              return (
                n ||
                  (n = function (t, n) {
                    (o =
                      t && n
                        ? l(t, n)
                        : {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            width: 0,
                            height: 0,
                          }),
                      e.forEach(function (t) {
                        t._checkForIntersections();
                      });
                  }),
                n
              );
            }),
            (s._resetCrossOriginUpdater = function () {
              (n = null), (o = null);
            }),
            (s.prototype.observe = function (t) {
              if (
                !this._observationTargets.some(function (e) {
                  return e.element == t;
                })
              ) {
                if (!t || 1 != t.nodeType)
                  throw new Error('target must be an Element');
                this._registerInstance(),
                  this._observationTargets.push({ element: t, entry: null }),
                  this._monitorIntersections(t.ownerDocument),
                  this._checkForIntersections();
              }
            }),
            (s.prototype.unobserve = function (t) {
              (this._observationTargets = this._observationTargets.filter(
                function (e) {
                  return e.element != t;
                }
              )),
                this._unmonitorIntersections(t.ownerDocument),
                0 == this._observationTargets.length &&
                  this._unregisterInstance();
            }),
            (s.prototype.disconnect = function () {
              (this._observationTargets = []),
                this._unmonitorAllIntersections(),
                this._unregisterInstance();
            }),
            (s.prototype.takeRecords = function () {
              var t = this._queuedEntries.slice();
              return (this._queuedEntries = []), t;
            }),
            (s.prototype._initThresholds = function (t) {
              var e = t || [0];
              return (
                Array.isArray(e) || (e = [e]),
                e.sort().filter(function (t, e, n) {
                  if ('number' != typeof t || isNaN(t) || t < 0 || t > 1)
                    throw new Error(
                      'threshold must be a number between 0 and 1 inclusively'
                    );
                  return t !== n[e - 1];
                })
              );
            }),
            (s.prototype._parseRootMargin = function (t) {
              var e = (t || '0px').split(/\s+/).map(function (t) {
                var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                if (!e)
                  throw new Error(
                    'rootMargin must be specified in pixels or percent'
                  );
                return { value: parseFloat(e[1]), unit: e[2] };
              });
              return (
                (e[1] = e[1] || e[0]),
                (e[2] = e[2] || e[0]),
                (e[3] = e[3] || e[1]),
                e
              );
            }),
            (s.prototype._monitorIntersections = function (e) {
              var n = e.defaultView;
              if (n && -1 == this._monitoringDocuments.indexOf(e)) {
                var o = this._checkForIntersections,
                  i = null,
                  s = null;
                this.POLL_INTERVAL
                  ? (i = n.setInterval(o, this.POLL_INTERVAL))
                  : (c(n, 'resize', o, !0),
                    c(e, 'scroll', o, !0),
                    this.USE_MUTATION_OBSERVER &&
                      'MutationObserver' in n &&
                      (s = new n.MutationObserver(o)).observe(e, {
                        attributes: !0,
                        childList: !0,
                        characterData: !0,
                        subtree: !0,
                      })),
                  this._monitoringDocuments.push(e),
                  this._monitoringUnsubscribes.push(function () {
                    var t = e.defaultView;
                    t && (i && t.clearInterval(i), u(t, 'resize', o, !0)),
                      u(e, 'scroll', o, !0),
                      s && s.disconnect();
                  });
                var a =
                  (this.root && (this.root.ownerDocument || this.root)) || t;
                if (e != a) {
                  var h = r(e);
                  h && this._monitorIntersections(h.ownerDocument);
                }
              }
            }),
            (s.prototype._unmonitorIntersections = function (e) {
              var n = this._monitoringDocuments.indexOf(e);
              if (-1 != n) {
                var o =
                    (this.root && (this.root.ownerDocument || this.root)) || t,
                  i = this._observationTargets.some(function (t) {
                    var n = t.element.ownerDocument;
                    if (n == e) return !0;
                    for (; n && n != o; ) {
                      var i = r(n);
                      if ((n = i && i.ownerDocument) == e) return !0;
                    }
                    return !1;
                  });
                if (!i) {
                  var s = this._monitoringUnsubscribes[n];
                  if (
                    (this._monitoringDocuments.splice(n, 1),
                    this._monitoringUnsubscribes.splice(n, 1),
                    s(),
                    e != o)
                  ) {
                    var c = r(e);
                    c && this._unmonitorIntersections(c.ownerDocument);
                  }
                }
              }
            }),
            (s.prototype._unmonitorAllIntersections = function () {
              var t = this._monitoringUnsubscribes.slice(0);
              (this._monitoringDocuments.length = 0),
                (this._monitoringUnsubscribes.length = 0);
              for (var e = 0; e < t.length; e++) t[e]();
            }),
            (s.prototype._checkForIntersections = function () {
              if (this.root || !n || o) {
                var t = this._rootIsInDom(),
                  e = t
                    ? this._getRootRect()
                    : {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                      };
                this._observationTargets.forEach(function (o) {
                  var r = o.element,
                    s = a(r),
                    c = this._rootContainsTarget(r),
                    u = o.entry,
                    h =
                      t && c && this._computeTargetAndRootIntersection(r, s, e),
                    l = null;
                  this._rootContainsTarget(r)
                    ? (n && !this.root) || (l = e)
                    : (l = {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                      });
                  var f = (o.entry = new i({
                    time:
                      window.performance &&
                      performance.now &&
                      performance.now(),
                    target: r,
                    boundingClientRect: s,
                    rootBounds: l,
                    intersectionRect: h,
                  }));
                  u
                    ? t && c
                      ? this._hasCrossedThreshold(u, f) &&
                        this._queuedEntries.push(f)
                      : u && u.isIntersecting && this._queuedEntries.push(f)
                    : this._queuedEntries.push(f);
                }, this),
                  this._queuedEntries.length &&
                    this._callback(this.takeRecords(), this);
              }
            }),
            (s.prototype._computeTargetAndRootIntersection = function (
              e,
              r,
              i
            ) {
              if ('none' != window.getComputedStyle(e).display) {
                for (
                  var s, c, u, h, f, d, m, g, w = r, y = p(e), v = !1;
                  !v && y;

                ) {
                  var b = null,
                    _ = 1 == y.nodeType ? window.getComputedStyle(y) : {};
                  if ('none' == _.display) return null;
                  if (y == this.root || 9 == y.nodeType)
                    if (((v = !0), y == this.root || y == t))
                      n && !this.root
                        ? !o || (0 == o.width && 0 == o.height)
                          ? ((y = null), (b = null), (w = null))
                          : (b = o)
                        : (b = i);
                    else {
                      var T = p(y),
                        E = T && a(T),
                        I =
                          T && this._computeTargetAndRootIntersection(T, E, i);
                      E && I
                        ? ((y = T), (b = l(E, I)))
                        : ((y = null), (w = null));
                    }
                  else {
                    var x = y.ownerDocument;
                    y != x.body &&
                      y != x.documentElement &&
                      'visible' != _.overflow &&
                      (b = a(y));
                  }
                  if (
                    (b &&
                      ((s = b),
                      (c = w),
                      (u = void 0),
                      (h = void 0),
                      (f = void 0),
                      (d = void 0),
                      (m = void 0),
                      (g = void 0),
                      (u = Math.max(s.top, c.top)),
                      (h = Math.min(s.bottom, c.bottom)),
                      (f = Math.max(s.left, c.left)),
                      (d = Math.min(s.right, c.right)),
                      (g = h - u),
                      (w =
                        ((m = d - f) >= 0 &&
                          g >= 0 && {
                            top: u,
                            bottom: h,
                            left: f,
                            right: d,
                            width: m,
                            height: g,
                          }) ||
                        null)),
                    !w)
                  )
                    break;
                  y = y && p(y);
                }
                return w;
              }
            }),
            (s.prototype._getRootRect = function () {
              var e;
              if (this.root && !d(this.root)) e = a(this.root);
              else {
                var n = d(this.root) ? this.root : t,
                  o = n.documentElement,
                  r = n.body;
                e = {
                  top: 0,
                  left: 0,
                  right: o.clientWidth || r.clientWidth,
                  width: o.clientWidth || r.clientWidth,
                  bottom: o.clientHeight || r.clientHeight,
                  height: o.clientHeight || r.clientHeight,
                };
              }
              return this._expandRectByRootMargin(e);
            }),
            (s.prototype._expandRectByRootMargin = function (t) {
              var e = this._rootMarginValues.map(function (e, n) {
                  return 'px' == e.unit
                    ? e.value
                    : (e.value * (n % 2 ? t.width : t.height)) / 100;
                }),
                n = {
                  top: t.top - e[0],
                  right: t.right + e[1],
                  bottom: t.bottom + e[2],
                  left: t.left - e[3],
                };
              return (
                (n.width = n.right - n.left), (n.height = n.bottom - n.top), n
              );
            }),
            (s.prototype._hasCrossedThreshold = function (t, e) {
              var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                o = e.isIntersecting ? e.intersectionRatio || 0 : -1;
              if (n !== o)
                for (var r = 0; r < this.thresholds.length; r++) {
                  var i = this.thresholds[r];
                  if (i == n || i == o || i < n != i < o) return !0;
                }
            }),
            (s.prototype._rootIsInDom = function () {
              return !this.root || f(t, this.root);
            }),
            (s.prototype._rootContainsTarget = function (e) {
              var n =
                (this.root && (this.root.ownerDocument || this.root)) || t;
              return f(n, e) && (!this.root || n == e.ownerDocument);
            }),
            (s.prototype._registerInstance = function () {
              e.indexOf(this) < 0 && e.push(this);
            }),
            (s.prototype._unregisterInstance = function () {
              var t = e.indexOf(this);
              -1 != t && e.splice(t, 1);
            }),
            (window.IntersectionObserver = s),
            (window.IntersectionObserverEntry = i);
        }
      function r(t) {
        try {
          return (t.defaultView && t.defaultView.frameElement) || null;
        } catch (t) {
          return null;
        }
      }
      function i(t) {
        (this.time = t.time),
          (this.target = t.target),
          (this.rootBounds = h(t.rootBounds)),
          (this.boundingClientRect = h(t.boundingClientRect)),
          (this.intersectionRect = h(
            t.intersectionRect || {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: 0,
              height: 0,
            }
          )),
          (this.isIntersecting = !!t.intersectionRect);
        var e = this.boundingClientRect,
          n = e.width * e.height,
          o = this.intersectionRect,
          r = o.width * o.height;
        this.intersectionRatio = n
          ? Number((r / n).toFixed(4))
          : this.isIntersecting
          ? 1
          : 0;
      }
      function s(t, e) {
        var n,
          o,
          r,
          i = e || {};
        if ('function' != typeof t)
          throw new Error('callback must be a function');
        if (i.root && 1 != i.root.nodeType && 9 != i.root.nodeType)
          throw new Error('root must be a Document or Element');
        (this._checkForIntersections =
          ((n = this._checkForIntersections.bind(this)),
          (o = this.THROTTLE_TIMEOUT),
          (r = null),
          function () {
            r ||
              (r = setTimeout(function () {
                n(), (r = null);
              }, o));
          })),
          (this._callback = t),
          (this._observationTargets = []),
          (this._queuedEntries = []),
          (this._rootMarginValues = this._parseRootMargin(i.rootMargin)),
          (this.thresholds = this._initThresholds(i.threshold)),
          (this.root = i.root || null),
          (this.rootMargin = this._rootMarginValues
            .map(function (t) {
              return t.value + t.unit;
            })
            .join(' ')),
          (this._monitoringDocuments = []),
          (this._monitoringUnsubscribes = []);
      }
      function c(t, e, n, o) {
        'function' == typeof t.addEventListener
          ? t.addEventListener(e, n, o || !1)
          : 'function' == typeof t.attachEvent && t.attachEvent('on' + e, n);
      }
      function u(t, e, n, o) {
        'function' == typeof t.removeEventListener
          ? t.removeEventListener(e, n, o || !1)
          : 'function' == typeof t.detatchEvent && t.detatchEvent('on' + e, n);
      }
      function a(t) {
        var e;
        try {
          e = t.getBoundingClientRect();
        } catch (t) {}
        return e
          ? ((e.width && e.height) ||
              (e = {
                top: e.top,
                right: e.right,
                bottom: e.bottom,
                left: e.left,
                width: e.right - e.left,
                height: e.bottom - e.top,
              }),
            e)
          : { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
      }
      function h(t) {
        return !t || 'x' in t
          ? t
          : {
              top: t.top,
              y: t.top,
              bottom: t.bottom,
              left: t.left,
              x: t.left,
              right: t.right,
              width: t.width,
              height: t.height,
            };
      }
      function l(t, e) {
        var n = e.top - t.top,
          o = e.left - t.left;
        return {
          top: n,
          left: o,
          height: e.height,
          width: e.width,
          bottom: n + e.height,
          right: o + e.width,
        };
      }
      function f(t, e) {
        for (var n = e; n; ) {
          if (n == t) return !0;
          n = p(n);
        }
        return !1;
      }
      function p(e) {
        var n = e.parentNode;
        return 9 == e.nodeType && e != t
          ? r(e)
          : (n && n.assignedSlot && (n = n.assignedSlot.parentNode),
            n && 11 == n.nodeType && n.host ? n.host : n);
      }
      function d(t) {
        return t && 9 === t.nodeType;
      }
    })(),
      /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */
      window.matchMedia ||
        (window.matchMedia = (function () {
          var t = window.styleMedia || window.media;
          if (!t) {
            var e,
              n = document.createElement('style'),
              o = document.getElementsByTagName('script')[0];
            (n.type = 'text/css'),
              (n.id = 'matchmediajs-test'),
              o
                ? o.parentNode.insertBefore(n, o)
                : document.head.appendChild(n),
              (e =
                ('getComputedStyle' in window &&
                  window.getComputedStyle(n, null)) ||
                n.currentStyle),
              (t = {
                matchMedium: function (t) {
                  var o =
                    '@media ' + t + '{ #matchmediajs-test { width: 1px; } }';
                  return (
                    n.styleSheet
                      ? (n.styleSheet.cssText = o)
                      : (n.textContent = o),
                    '1px' === e.width
                  );
                },
              });
          }
          return function (e) {
            return { matches: t.matchMedium(e || 'all'), media: e || 'all' };
          };
        })()),
      /*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. MIT license */
      (function () {
        if (window.matchMedia && window.matchMedia('all').addListener)
          return !1;
        var t = window.matchMedia,
          e = t('only all').matches,
          n = !1,
          o = 0,
          r = [],
          i = function (e) {
            clearTimeout(o),
              (o = setTimeout(function () {
                for (var e = 0, n = r.length; e < n; e++) {
                  var o = r[e].mql,
                    i = r[e].listeners || [],
                    s = t(o.media).matches;
                  if (s !== o.matches) {
                    o.matches = s;
                    for (var c = 0, u = i.length; c < u; c++)
                      i[c].call(window, o);
                  }
                }
              }, 30));
          };
        window.matchMedia = function (o) {
          var s = t(o),
            c = [],
            u = 0;
          return (
            (s.addListener = function (t) {
              e &&
                (n || ((n = !0), window.addEventListener('resize', i, !0)),
                0 === u && (u = r.push({ mql: s, listeners: c })),
                c.push(t));
            }),
            (s.removeListener = function (t) {
              for (var e = 0, n = c.length; e < n; e++)
                c[e] === t && c.splice(e, 1);
            }),
            s
          );
        };
      })(),
      (t =
        ('undefined' != typeof process &&
          '[object process]' === {}.toString.call(process)) ||
        ('undefined' != typeof navigator && 'ReactNative' === navigator.product)
          ? e
          : self).Proxy ||
        ((t.Proxy = (function () {
          function t() {
            return null;
          }
          function e(t) {
            return !!t && ('object' == typeof t || 'function' == typeof t);
          }
          function n(t) {
            if (null !== t && !e(t))
              throw new TypeError(
                'Object prototype may only be an Object or null: ' + t
              );
          }
          var o = null,
            r = Object,
            i = !(!r.create && { __proto__: null } instanceof r),
            s =
              r.create ||
              (i
                ? function (t) {
                    return n(t), { __proto__: t };
                  }
                : function (t) {
                    function e() {}
                    if ((n(t), null === t))
                      throw new SyntaxError(
                        'Native Object.create is required to create objects with null prototype'
                      );
                    return (e.prototype = t), new e();
                  }),
            c =
              r.getPrototypeOf ||
              ([].__proto__ === Array.prototype
                ? function (t) {
                    return e((t = t.__proto__)) ? t : null;
                  }
                : t),
            u = function (a, h) {
              function l() {}
              if (
                void 0 ===
                (this && this instanceof u ? this.constructor : void 0)
              )
                throw new TypeError("Constructor Proxy requires 'new'");
              if (!e(a) || !e(h))
                throw new TypeError(
                  'Cannot create proxy with a non-object as target or handler'
                );
              (o = function () {
                (a = null),
                  (l = function (t) {
                    throw new TypeError(
                      "Cannot perform '" +
                        t +
                        "' on a proxy that has been revoked"
                    );
                  });
              }),
                setTimeout(function () {
                  o = null;
                }, 0);
              var f = h;
              for (var p in ((h = {
                get: null,
                set: null,
                apply: null,
                construct: null,
              }),
              f)) {
                if (!(p in h))
                  throw new TypeError(
                    "Proxy polyfill does not support trap '" + p + "'"
                  );
                h[p] = f[p];
              }
              'function' == typeof f && (h.apply = f.apply.bind(f)), (f = c(a));
              var d = !1,
                m = !1;
              if ('function' == typeof a) {
                var g = function () {
                  var t = this && this.constructor === g,
                    e = Array.prototype.slice.call(arguments);
                  return (
                    l(t ? 'construct' : 'apply'),
                    t && h.construct
                      ? h.construct.call(this, a, e)
                      : !t && h.apply
                      ? h.apply(a, this, e)
                      : t
                      ? (e.unshift(a), new (a.bind.apply(a, e))())
                      : a.apply(this, e)
                  );
                };
                d = !0;
              } else
                a instanceof Array
                  ? ((g = []), (m = !0))
                  : (g = i || null !== f ? s(f) : {});
              var w = h.get
                  ? function (t) {
                      return l('get'), h.get(this, t, g);
                    }
                  : function (t) {
                      return l('get'), this[t];
                    },
                y = h.set
                  ? function (t, e) {
                      l('set'), h.set(this, t, e, g);
                    }
                  : function (t, e) {
                      l('set'), (this[t] = e);
                    },
                v = {};
              if (
                (r.getOwnPropertyNames(a).forEach(function (t) {
                  if ((!d && !m) || !(t in g)) {
                    var e = r.getOwnPropertyDescriptor(a, t);
                    r.defineProperty(g, t, {
                      enumerable: !!e.enumerable,
                      get: w.bind(a, t),
                      set: y.bind(a, t),
                    }),
                      (v[t] = !0);
                  }
                }),
                (p = !0),
                d || m)
              ) {
                var b =
                  r.setPrototypeOf ||
                  ([].__proto__ === Array.prototype
                    ? function (t, e) {
                        return n(e), (t.__proto__ = e), t;
                      }
                    : t);
                (f && b(g, f)) || (p = !1);
              }
              if (h.get || !p)
                for (var _ in a)
                  v[_] || r.defineProperty(g, _, { get: w.bind(a, _) });
              return r.seal(a), r.seal(g), g;
            };
          return (
            (u.revocable = function (t, e) {
              return { proxy: new u(t, e), revoke: o };
            }),
            u
          );
        })()),
        (t.Proxy.revocable = t.Proxy.revocable));
    var n = { exports: {} },
      o = { exports: {} };
    (function () {
      var t, e, n, r, i, s;
      'undefined' != typeof performance &&
      null !== performance &&
      performance.now
        ? (o.exports = function () {
            return performance.now();
          })
        : 'undefined' != typeof process && null !== process && process.hrtime
        ? ((o.exports = function () {
            return (t() - i) / 1e6;
          }),
          (e = process.hrtime),
          (r = (t = function () {
            var t;
            return 1e9 * (t = e())[0] + t[1];
          })()),
          (s = 1e9 * process.uptime()),
          (i = r - s))
        : Date.now
        ? ((o.exports = function () {
            return Date.now() - n;
          }),
          (n = Date.now()))
        : ((o.exports = function () {
            return new Date().getTime() - n;
          }),
          (n = new Date().getTime()));
    }.call(e));
    for (
      var r = o.exports,
        i = 'undefined' == typeof window ? e : window,
        s = ['moz', 'webkit'],
        c = 'AnimationFrame',
        u = i['request' + c],
        a = i['cancel' + c] || i['cancelRequest' + c],
        h = 0;
      !u && h < s.length;
      h++
    )
      (u = i[s[h] + 'Request' + c]),
        (a = i[s[h] + 'Cancel' + c] || i[s[h] + 'CancelRequest' + c]);
    if (!u || !a) {
      var l = 0,
        f = 0,
        p = [];
      (u = function (t) {
        if (0 === p.length) {
          var e = r(),
            n = Math.max(0, 16.666666666666668 - (e - l));
          (l = n + e),
            setTimeout(function () {
              var t = p.slice(0);
              p.length = 0;
              for (var e = 0; e < t.length; e++)
                if (!t[e].cancelled)
                  try {
                    t[e].callback(l);
                  } catch (t) {
                    setTimeout(function () {
                      throw t;
                    }, 0);
                  }
            }, Math.round(n));
        }
        return p.push({ handle: ++f, callback: t, cancelled: !1 }), f;
      }),
        (a = function (t) {
          for (var e = 0; e < p.length; e++)
            p[e].handle === t && (p[e].cancelled = !0);
        });
    }
    (n.exports = function (t) {
      return u.call(i, t);
    }),
      (n.exports.cancel = function () {
        a.apply(i, arguments);
      }),
      (n.exports.polyfill = function (t) {
        t || (t = i),
          (t.requestAnimationFrame = u),
          (t.cancelAnimationFrame = a);
      }),
      (function () {
        if ('undefined' != typeof window) {
          var t = (document.getElementsByTagName('base')[0] || {}).href || '';
          if (
            t &&
            1 === t.split(window.location.origin).length &&
            window.history.replaceState
          ) {
            var e = document.createElement('meta');
            (e.name = 'next-head-count'),
              (e.content = '0'),
              document.getElementsByTagName('head')[0].appendChild(e),
              (window.history.replaceState = function () {});
          }
        }
      })();
    return n.exports.polyfill(), {};
  });
}
