// support window.location.origin
var location = window.location;
if (!window.location.origin) {
  window.location.origin =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
}

function historyPolyfill(option) {
  var pathname = location.pathname;
  var search = location.search;

  if (pathname + search === option.as) return;

  window.location.href = option.as;
}
window.history.replaceState = window.history.replaceState || historyPolyfill;
window.history.pushState = window.history.pushState || historyPolyfill;
