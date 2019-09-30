import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'classlist-polyfill';
import 'intersection-observer';

function historyPolyfill(option) {
  var pathname = window.location.pathname;
  var search = window.location.search;

  if (pathname + search === option.as) return;

  window.location.href = option.as;
}
window.history.replaceState = window.history.replaceState || historyPolyfill;
window.history.pushState = window.history.pushState || historyPolyfill;
