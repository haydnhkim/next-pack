function __spack_require__(mod) {
  var cache;
  if (cache) {
    return cache;
  }
  var module = {
    exports: {},
  };
  mod(module, module.exports);
  cache = module.exports;
  return cache;
}
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */ /*global self, document, DOMException */ /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */ if (
  'document' in window.self
) {
  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (
    !('classList' in document.createElement('_')) ||
    (document.createElementNS &&
      !(
        'classList' in
        document.createElementNS('http://www.w3.org/2000/svg', 'g')
      ))
  )
    (function (view) {
      if (!('Element' in view)) return;
      var classListProp = 'classList',
        protoProp = 'prototype',
        elemCtrProto = view.Element[protoProp],
        objCtr = Object,
        strTrim =
          String[protoProp].trim ||
          function () {
            return this.replace(/^\s+|\s+$/g, '');
          },
        arrIndexOf =
          Array[protoProp].indexOf ||
          function (item) {
            var i = 0,
              len = this.length;
            for (; i < len; i++) {
              if (i in this && this[i] === item) return i;
            }
            return -1;
          },
        DOMEx = function (type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        },
        checkTokenAndGetIndex = function (classList, token) {
          if (token === '')
            throw new DOMEx(
              'SYNTAX_ERR',
              'An invalid or illegal string was specified'
            );
          if (/\s/.test(token))
            throw new DOMEx(
              'INVALID_CHARACTER_ERR',
              'String contains an invalid character'
            );
          return arrIndexOf.call(classList, token);
        },
        ClassList = function (elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
          for (; i < len; i++) this.push(classes[i]);
          this._updateClassName = function () {
            elem.setAttribute('class', this.toString());
          };
        },
        classListProto = (ClassList[protoProp] = []),
        classListGetter = function () {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false;
        do {
          token = tokens[i] + '';
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) this._updateClassName();
      };
      classListProto.remove = function () {
        var tokens = arguments,
          i = 0,
          l = tokens.length,
          token,
          updated = false,
          index;
        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) this._updateClassName();
      };
      classListProto.toggle = function (token, force) {
        token += '';
        var result = this.contains(token),
          method = result
            ? force !== true && 'remove'
            : force !== false && 'add';
        if (method) this[method](token);
        if (force === true || force === false) return force;
        else return !result;
      };
      classListProto.toString = function () {
        return this.join(' ');
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true,
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -2146823252) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(
              elemCtrProto,
              classListProp,
              classListPropDesc
            );
          }
        }
      } else if (objCtr[protoProp].__defineGetter__)
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
    })(window.self);
  (function () {
    var testElement = document.createElement('_');
    testElement.classList.add('c1', 'c2');
    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains('c2')) {
      var createMethod = function (method) {
        var original = DOMTokenList.prototype[method];
        DOMTokenList.prototype[method] = function (token) {
          var i,
            len = arguments.length;
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
    testElement.classList.toggle('c3', false);
    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains('c3')) {
      var _toggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) return force;
        else return _toggle.call(this, token);
      };
    }
    testElement = null;
  })();
}
var load = __spack_require__.bind(void 0, function (module, exports) {
  (function (window, document) {
    /*jshint evil:true */ /** version */ var version = '3.7.3-pre';
    /** Preset options */ var options = window.html5 || {};
    /** Used to skip problem elements */ var reSkip =
      /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    /** Not all elements can be cloned in IE **/ var saveClones =
      /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    /** Detect whether the browser supports default html5 styles */ var supportsHtml5Styles;
    /** Name of the expando, to work with multiple documents or to re-shiv one document */ var expando =
      '_html5shiv';
    /** The id for the the documents expando */ var expanID = 0;
    /** Cached data for each document */ var expandoData = {};
    /** Detect whether the browser supports unknown elements */ var supportsUnknownElements;
    (function () {
      try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = 'hidden' in a;
        supportsUnknownElements =
          a.childNodes.length == 1 ||
          (function () {
            // assign a false positive if unable to shiv
            document.createElement('a');
            var frag = document.createDocumentFragment();
            return (
              typeof frag.cloneNode == 'undefined' ||
              typeof frag.createDocumentFragment == 'undefined' ||
              typeof frag.createElement == 'undefined'
            );
          })();
      } catch (e) {
        // assign a false positive if detection fails => unable to shiv
        supportsHtml5Styles = true;
        supportsUnknownElements = true;
      }
    })();
    /*--------------------------------------------------------------------------*/ /**
     * Creates a style sheet with the given CSS text and adds it to the document.
     * @private
     * @param {Document} ownerDocument The document.
     * @param {String} cssText The CSS text.
     * @returns {StyleSheet} The style element.
     */ function addStyleSheet(ownerDocument, cssText) {
      var p = ownerDocument.createElement('p'),
        parent =
          ownerDocument.getElementsByTagName('head')[0] ||
          ownerDocument.documentElement;
      p.innerHTML = 'x<style>' + cssText + '</style>';
      return parent.insertBefore(p.lastChild, parent.firstChild);
    }
    /**
     * Returns the value of `html5.elements` as an array.
     * @private
     * @returns {Array} An array of shived element node names.
     */ function getElements() {
      var elements = html5.elements;
      return typeof elements == 'string' ? elements.split(' ') : elements;
    }
    /**
     * Extends the built-in list of html5 elements
     * @memberOf html5
     * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
     * @param {Document} ownerDocument The context document.
     */ function addElements(newElements, ownerDocument) {
      var elements = html5.elements;
      if (typeof elements != 'string') elements = elements.join(' ');
      if (typeof newElements != 'string') newElements = newElements.join(' ');
      html5.elements = elements + ' ' + newElements;
      shivDocument(ownerDocument);
    }
    /**
     * Returns the data associated to the given document
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Object} An object of data.
     */ function getExpandoData(ownerDocument) {
      var data = expandoData[ownerDocument[expando]];
      if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
      }
      return data;
    }
    /**
     * returns a shived element for the given nodeName and document
     * @memberOf html5
     * @param {String} nodeName name of the element
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived element.
     */ function createElement(nodeName, ownerDocument, data) {
      if (!ownerDocument) ownerDocument = document;
      if (supportsUnknownElements) return ownerDocument.createElement(nodeName);
      if (!data) data = getExpandoData(ownerDocument);
      var node;
      if (data.cache[nodeName]) node = data.cache[nodeName].cloneNode();
      else if (saveClones.test(nodeName))
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
      else node = data.createElem(nodeName);
      // Avoid adding some elements to fragments in IE < 9 because
      // * Attributes like `name` or `type` cannot be set/changed once an element
      //   is inserted into a document/fragment
      // * Link elements with `src` attributes that are inaccessible, as with
      //   a 403 response, will cause the tab/window to crash
      // * Script elements appended to fragments will execute when their `src`
      //   or `text` property is set
      return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn
        ? data.frag.appendChild(node)
        : node;
    }
    /**
     * returns a shived DocumentFragment for the given document
     * @memberOf html5
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived DocumentFragment.
     */ function createDocumentFragment(ownerDocument, data) {
      if (!ownerDocument) ownerDocument = document;
      if (supportsUnknownElements)
        return ownerDocument.createDocumentFragment();
      data = data || getExpandoData(ownerDocument);
      var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
      for (; i < l; i++) clone.createElement(elems[i]);
      return clone;
    }
    /**
     * Shivs the `createElement` and `createDocumentFragment` methods of the document.
     * @private
     * @param {Document|DocumentFragment} ownerDocument The document.
     * @param {Object} data of the document.
     */ function shivMethods(ownerDocument, data) {
      if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
      }
      ownerDocument.createElement = function (nodeName) {
        //abort shiv
        if (!html5.shivMethods) return data.createElem(nodeName);
        return createElement(nodeName, ownerDocument, data);
      };
      ownerDocument.createDocumentFragment = Function(
        'h,f',
        'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' + // unroll the `createElement` calls
          getElements()
            .join()
            .replace(/[\w\-:]+/g, function (nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
      )(html5, data.frag);
    }
    /*--------------------------------------------------------------------------*/ /**
     * Shivs the given document.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */ function shivDocument(ownerDocument) {
      if (!ownerDocument) ownerDocument = document;
      var data = getExpandoData(ownerDocument);
      if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS)
        data.hasCSS = !!addStyleSheet(
          ownerDocument, // corrects block display not defined in IE6/7/8/9
          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}'
        );
      if (!supportsUnknownElements) shivMethods(ownerDocument, data);
      return ownerDocument;
    }
    /*--------------------------------------------------------------------------*/ /**
     * The `html5` object is exposed so that more elements can be shived and
     * existing shiving can be detected on iframes.
     * @type Object
     * @example
     *
     * // options can be changed before the script is included
     * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
     */ var html5 = {
      /**
       * An array or space separated string of node names of the elements to shiv.
       * @memberOf html5
       * @type Array|String
       */ elements:
        options.elements ||
        'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',
      /**
       * current version of html5shiv
       */ version: version,
      /**
       * A flag to indicate that the HTML5 style sheet should be inserted.
       * @memberOf html5
       * @type Boolean
       */ shivCSS: options.shivCSS !== false,
      /**
       * Is equal to true if a browser supports creating unknown/HTML5 elements
       * @memberOf html5
       * @type boolean
       */ supportsUnknownElements: supportsUnknownElements,
      /**
       * A flag to indicate that the document's `createElement` and `createDocumentFragment`
       * methods should be overwritten.
       * @memberOf html5
       * @type Boolean
       */ shivMethods: options.shivMethods !== false,
      /**
       * A string to describe the type of `html5` object ("default" or "default print").
       * @memberOf html5
       * @type String
       */ type: 'default',
      // shivs the document according to the specified `html5` object options
      shivDocument: shivDocument,
      //creates a shived element
      createElement: createElement,
      //creates a shived documentFragment
      createDocumentFragment: createDocumentFragment,
      //extends list of elements
      addElements: addElements,
    };
    /*--------------------------------------------------------------------------*/ // expose html5
    window.html5 = html5;
    // shiv the document
    shivDocument(document);
    if (typeof module == 'object' && module.exports) module.exports = html5;
  })(typeof window !== 'undefined' ? window : this, document);
});
// support window.location.origin
if (!window.location.origin)
  window.location.origin =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '');
function historyPolyfill(option) {
  var pathname = window.location.pathname;
  var search = window.location.search;
  if (pathname + search === option.as) return;
  window.location.href = option.as;
}
if (!window.history.replaceState) window.history.replaceState = historyPolyfill;
if (!window.history.pushState) window.history.pushState = historyPolyfill;
load();
