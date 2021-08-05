// for web cache of search engine using base tag
(function () {
  if (typeof window === 'undefined') return;

  var baseHref = (document.getElementsByTagName('base')[0] || {}).href || '';

  if (
    baseHref &&
    baseHref.split(window.location.origin).length === 1 &&
    window.history.replaceState
  ) {
    var meta = document.createElement('meta');
    meta.name = 'next-head-count';
    meta.content = '0';
    document.getElementsByTagName('head')[0].appendChild(meta);
    window.history.replaceState = function () {};
  }
})();
