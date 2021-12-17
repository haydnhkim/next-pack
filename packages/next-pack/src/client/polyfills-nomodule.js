if (typeof window !== 'undefined') {
  !(function (e, t) {
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = t())
      : 'function' == typeof define && define.amd
      ? define(t)
      : ((e = 'undefined' != typeof globalThis ? globalThis : e || self)[
          'polyfills-nomodule'
        ] = t());
  })(this, function () {
    'use strict';
    var e =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : {};
    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
    'document' in window.self &&
      ((!('classList' in document.createElement('_')) ||
        (document.createElementNS &&
          !(
            'classList' in
            document.createElementNS('http://www.w3.org/2000/svg', 'g')
          ))) &&
        (function (e) {
          if ('Element' in e) {
            var t = 'classList',
              n = e.Element.prototype,
              o = Object,
              i =
                String.prototype.trim ||
                function () {
                  return this.replace(/^\s+|\s+$/g, '');
                },
              r =
                Array.prototype.indexOf ||
                function (e) {
                  for (var t = 0, n = this.length; t < n; t++)
                    if (t in this && this[t] === e) return t;
                  return -1;
                },
              a = function (e, t) {
                (this.name = e),
                  (this.code = DOMException[e]),
                  (this.message = t);
              },
              s = function (e, t) {
                if ('' === t)
                  throw new a(
                    'SYNTAX_ERR',
                    'An invalid or illegal string was specified'
                  );
                if (/\s/.test(t))
                  throw new a(
                    'INVALID_CHARACTER_ERR',
                    'String contains an invalid character'
                  );
                return r.call(e, t);
              },
              c = function (e) {
                for (
                  var t = i.call(e.getAttribute('class') || ''),
                    n = t ? t.split(/\s+/) : [],
                    o = 0,
                    r = n.length;
                  o < r;
                  o++
                )
                  this.push(n[o]);
                this._updateClassName = function () {
                  e.setAttribute('class', this.toString());
                };
              },
              l = (c.prototype = []),
              u = function () {
                return new c(this);
              };
            if (
              ((a.prototype = Error.prototype),
              (l.item = function (e) {
                return this[e] || null;
              }),
              (l.contains = function (e) {
                return -1 !== s(this, (e += ''));
              }),
              (l.add = function () {
                var e,
                  t = arguments,
                  n = 0,
                  o = t.length,
                  i = !1;
                do {
                  (e = t[n] + ''),
                    -1 === s(this, e) && (this.push(e), (i = !0));
                } while (++n < o);
                i && this._updateClassName();
              }),
              (l.remove = function () {
                var e,
                  t,
                  n = arguments,
                  o = 0,
                  i = n.length,
                  r = !1;
                do {
                  for (e = n[o] + '', t = s(this, e); -1 !== t; )
                    this.splice(t, 1), (r = !0), (t = s(this, e));
                } while (++o < i);
                r && this._updateClassName();
              }),
              (l.toggle = function (e, t) {
                e += '';
                var n = this.contains(e),
                  o = n ? !0 !== t && 'remove' : !1 !== t && 'add';
                return o && this[o](e), !0 === t || !1 === t ? t : !n;
              }),
              (l.toString = function () {
                return this.join(' ');
              }),
              o.defineProperty)
            ) {
              var d = { get: u, enumerable: !0, configurable: !0 };
              try {
                o.defineProperty(n, t, d);
              } catch (e) {
                (void 0 !== e.number && -2146823252 !== e.number) ||
                  ((d.enumerable = !1), o.defineProperty(n, t, d));
              }
            } else o.prototype.__defineGetter__ && n.__defineGetter__(t, u);
          }
        })(window.self),
      (function () {
        var e = document.createElement('_');
        if ((e.classList.add('c1', 'c2'), !e.classList.contains('c2'))) {
          var t = function (e) {
            var t = DOMTokenList.prototype[e];
            DOMTokenList.prototype[e] = function (e) {
              var n,
                o = arguments.length;
              for (n = 0; n < o; n++) (e = arguments[n]), t.call(this, e);
            };
          };
          t('add'), t('remove');
        }
        if ((e.classList.toggle('c3', !1), e.classList.contains('c3'))) {
          var n = DOMTokenList.prototype.toggle;
          DOMTokenList.prototype.toggle = function (e, t) {
            return 1 in arguments && !this.contains(e) == !t
              ? t
              : n.call(this, e);
          };
        }
        e = null;
      })());
    function t(e) {
      window.location.pathname + window.location.search !== e.as &&
        (window.location.href = e.as);
    }
    /**
     * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    return (
      (function (t) {
        !(function (e, n) {
          var o,
            i,
            r = e.html5 || {},
            a =
              /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
            s =
              /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
            c = '_html5shiv',
            l = 0,
            u = {};
          function d() {
            var e = m.elements;
            return 'string' == typeof e ? e.split(' ') : e;
          }
          function f(e) {
            var t = u[e[c]];
            return t || ((t = {}), l++, (e[c] = l), (u[l] = t)), t;
          }
          function h(e, t, o) {
            return (
              t || (t = n),
              i
                ? t.createElement(e)
                : (o || (o = f(t)),
                  !(r = o.cache[e]
                    ? o.cache[e].cloneNode()
                    : s.test(e)
                    ? (o.cache[e] = o.createElem(e)).cloneNode()
                    : o.createElem(e)).canHaveChildren ||
                  a.test(e) ||
                  r.tagUrn
                    ? r
                    : o.frag.appendChild(r))
            );
            var r;
          }
          function p(e) {
            e || (e = n);
            var t = f(e);
            return (
              !m.shivCSS ||
                o ||
                t.hasCSS ||
                (t.hasCSS = !!(function (e, t) {
                  var n = e.createElement('p'),
                    o = e.getElementsByTagName('head')[0] || e.documentElement;
                  return (
                    (n.innerHTML = 'x<style>' + t + '</style>'),
                    o.insertBefore(n.lastChild, o.firstChild)
                  );
                })(
                  e,
                  'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}'
                )),
              i ||
                (function (e, t) {
                  t.cache ||
                    ((t.cache = {}),
                    (t.createElem = e.createElement),
                    (t.createFrag = e.createDocumentFragment),
                    (t.frag = t.createFrag())),
                    (e.createElement = function (n) {
                      return m.shivMethods ? h(n, e, t) : t.createElem(n);
                    }),
                    (e.createDocumentFragment = Function(
                      'h,f',
                      'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' +
                        d()
                          .join()
                          .replace(/[\w\-:]+/g, function (e) {
                            return (
                              t.createElem(e),
                              t.frag.createElement(e),
                              'c("' + e + '")'
                            );
                          }) +
                        ');return n}'
                    )(m, t.frag));
                })(e, t),
              e
            );
          }
          !(function () {
            try {
              var e = n.createElement('a');
              (e.innerHTML = '<xyz></xyz>'),
                (o = 'hidden' in e),
                (i =
                  1 == e.childNodes.length ||
                  (function () {
                    n.createElement('a');
                    var e = n.createDocumentFragment();
                    return (
                      void 0 === e.cloneNode ||
                      void 0 === e.createDocumentFragment ||
                      void 0 === e.createElement
                    );
                  })());
            } catch (e) {
              (o = !0), (i = !0);
            }
          })();
          var m = {
            elements:
              r.elements ||
              'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',
            version: '3.7.3-pre',
            shivCSS: !1 !== r.shivCSS,
            supportsUnknownElements: i,
            shivMethods: !1 !== r.shivMethods,
            type: 'default',
            shivDocument: p,
            createElement: h,
            createDocumentFragment: function (e, t) {
              if ((e || (e = n), i)) return e.createDocumentFragment();
              for (
                var o = (t = t || f(e)).frag.cloneNode(),
                  r = 0,
                  a = d(),
                  s = a.length;
                r < s;
                r++
              )
                o.createElement(a[r]);
              return o;
            },
            addElements: function (e, t) {
              var n = m.elements;
              'string' != typeof n && (n = n.join(' ')),
                'string' != typeof e && (e = e.join(' ')),
                (m.elements = n + ' ' + e),
                p(t);
            },
          };
          (e.html5 = m), p(n), t.exports && (t.exports = m);
        })('undefined' != typeof window ? window : e, document);
      })({ exports: {} }),
      window.location.origin ||
        (window.location.origin =
          window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : '')),
      window.history.replaceState || (window.history.replaceState = t),
      window.history.pushState || (window.history.pushState = t),
      {}
    );
  });
}
