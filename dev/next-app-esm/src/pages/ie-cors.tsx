import React, { useState } from 'react';

const readyText = '✨ Please click the fetch button! ✨';
const loadingText = '⚡ Loading...';

const Page = () => {
  const [outputText, setOutputText] = useState(readyText);

  const handleClick = () => {
    const url = `https://httpbin.org/get?fetch=true&timestamp=${new Date().toISOString()}`;

    setOutputText(loadingText);
    fetch(url)
      .then(function (response) {
        console.log('Header:', response.headers.get('Content-Type'));
        console.log('Response:', response);
        return response.json();
      })
      .then(function (json) {
        const messages = [
          `🌏 URL: ${url}`,
          `🕗 Time: ${new Date().toISOString()}`,
          `🔊 Response: ${JSON.stringify(json, null, 2)}`,
        ];
        setOutputText(messages.join('\n'));
        console.log('Got json:', json);
      })
      .catch((error) => {
        setOutputText(`💔 Fetch error: ${error.message}`);
        console.error('Failed:', error);
      });
  };

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="//nuintun.github.io/fetch/examples/index.css"
      />
      <div>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <button className="ui-button ui-button-green" onClick={handleClick}>
          ⚡ fetch ⚡
        </button>
      </div>
      <div>
        <pre id="output">{outputText}</pre>
      </div>
      example layout using by{' '}
      <a href="https://github.com/nuintun/fetch">@nuintun/fetch</a>&apos;s
      example
    </div>
  );
};

export default Page;
