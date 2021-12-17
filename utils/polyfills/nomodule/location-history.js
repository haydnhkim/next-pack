// support window.location.origin
if (!window.location.origin) {
  window.location.origin =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '');
}

function historyPolyfill(option) {
  var pathname = window.location.pathname;
  var search = window.location.search;

  if (pathname + search === option.as) return;

  window.location.href = option.as;
}
if (!window.history.replaceState) window.history.replaceState = historyPolyfill;
if (!window.history.pushState) window.history.pushState = historyPolyfill;
