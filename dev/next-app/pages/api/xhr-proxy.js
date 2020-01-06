import qs from 'qs';
import fetch from 'isomorphic-unfetch';

const xhrProxy = async (req, res) => {
  const { method, query, headers = {}, body } = req;
  const { url } = query;

  if (!url)
    return res.status(400).json({
      errorCode: 400,
      message: 'required `url` params.',
    });

  const urlItem = new URL(url);
  const search = qs.parse(urlItem.search.substring(1));
  const queryString = qs.stringify(search);
  const encodedUrl = `${urlItem.origin.replace('https:', 'http:')}${
    urlItem.pathname
  }${queryString ? `?${queryString}` : ''}`;

  headers.origin = headers.host;
  headers.host = urlItem.host;

  let result;
  try {
    result = await fetch(encodedUrl, {
      method,
      headers,
      credentials: 'include',
      redirect: 'follow',
      referrer: 'no-referrer',
      ...(body && { body: JSON.stringify(body) }),
    });
  } catch (err) {
    console.error('err', err);
    return res.status(500).send(err.toString());
  }

  res.setHeader('content-type', result.headers.get('content-type'));

  const text = await result.text();
  let json;
  try {
    json = await result.json();
  } catch (err) {}

  if (json) return res.status(result.status).json(json);

  res.status(result.status).send(text);
};

export default xhrProxy;
