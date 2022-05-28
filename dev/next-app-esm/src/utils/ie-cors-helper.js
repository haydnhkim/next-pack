const ieCorsHelper = () => {
  let withCredentials = false;
  try {
    withCredentials = 'withCredentials' in new window.XMLHttpRequest();
  } catch (e) {}

  if (withCredentials) return;

  const xhrOpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function (...args) {
    const url = args[1];

    if (!['/', window.location.origin].some((n) => url.startsWith(n))) {
      args[1] = `/api/xhr-proxy?url=${encodeURIComponent(url)}`;
    }

    return xhrOpen.bind(this)(...args);
  };
};

export default ieCorsHelper;
