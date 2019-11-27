// Detecting Internet Explorer, Edge or Android 4
(function() {
  if (typeof window === 'undefined') return;

  var ua = navigator.userAgent;
  var isIE = /MSIE \d|Trident.*rv:|Edge/.test(ua);
  var isAndroid = ua.indexOf('Android') > -1;

  if (!isIE && !isAndroid) return;
  if (isAndroid) {
    var matches = ua.match(/Android (\d.\d.\d)/);
    if (!matches || !matches[1]) return;

    var version = parseFloat(matches[1]);
    if (5 <= version) return;
  }

  var assetPrefix =
    (window.__NEXT_DATA__ || {}).assetPrefix ||
    (/assetPrefix":"([^"]+)/.exec(
      document.getElementById('__NEXT_DATA__').text
    ) || [])[1] ||
    '';
  var polyfillSrc = assetPrefix + '/_next/static/runtime/polyfill.js';

  document.write('<script src="' + polyfillSrc + '"></script>');
})();
