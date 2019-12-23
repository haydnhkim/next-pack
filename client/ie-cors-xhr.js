var withCredentials = false;
try {
  withCredentials = 'withCredentials' in new window.XMLHttpRequest();
} catch (e) {}
if (!withCredentials && window.XDomainRequest) {
  window.XMLHttpRequest = window.XDomainRequest;
  window.XMLHttpRequest.prototype.getAllResponseHeaders = function() {
    return '';
  };
}
