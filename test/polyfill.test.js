/**
 * @jest-environment node
 */
const fetch = require('node-fetch');

const headers = {
  'User-Agent':
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; iftNxParam=1.0.1)',
};

// Next.js has logic to remove duplicate modules
// so it is necessary to check whether all modules exist.
test(
  'should be inserted a polyfill',
  (done) => {
    const intervalId = setInterval(async () => {
      let res;
      try {
        res = await fetch(`http://localhost:3000`, {
          headers,
        });
      } catch (err) {
        return;
      }
      let html = await res.text();
      html = html.replace(/<\/script>/g, '</script>\n');

      // polyfills-nomodule
      const polyfillJsSrc = /src="(.+polyfill.+js)"/g.exec(html);
      // polyfills-module
      const mainJsSrc = /src="(.+main.+js)"/g.exec(html);

      if (!polyfillJsSrc || !mainJsSrc) return;

      let polyfillJsRes;
      try {
        polyfillJsRes = await fetch(
          `http://localhost:3000${polyfillJsSrc[1]}`,
          {
            headers,
          }
        );
      } catch (err) {
        return;
      }
      let polyfillJs = await polyfillJsRes.text();

      expect(polyfillJs.includes('classList')).toBeTruthy();
      expect(polyfillJs.includes('html5')).toBeTruthy();
      expect(polyfillJs.includes('window.location.origin')).toBeTruthy();

      let mainJsRes;
      try {
        mainJsRes = await fetch(`http://localhost:3000${mainJsSrc[1]}`, {
          headers,
        });
      } catch (err) {
        return;
      }
      let mainJs = await mainJsRes.text();

      expect(mainJs.includes('IntersectionObserver')).toBeTruthy();
      expect(mainJs.includes('matchMedia')).toBeTruthy();
      expect(mainJs.includes('proxy')).toBeTruthy();
      expect(mainJs.includes('requestAnimationFrame')).toBeTruthy();
      expect(mainJs.includes('next-head-count')).toBeTruthy();

      clearInterval(intervalId);
      done();
    }, 500);
  },
  30 * 1000
);

afterAll(async () => {
  await fetch('http://localhost:3000/close');
});
