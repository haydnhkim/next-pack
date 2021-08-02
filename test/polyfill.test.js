/**
 * @jest-environment node
 */
const fetch = require('node-fetch');

const headers = {
  'User-Agent':
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; iftNxParam=1.0.1)',
};

beforeAll(async () => {
  await require('../dev/next-app/src/server');
});

// Next.js has logic to remove duplicate modules
// so it is necessary to check whether all modules exist.
test(
  'should be inserted a polyfill',
  (done) => {
    (async () => {
      let res;
      try {
        res = await fetch(`http://0.0.0.0:3000`, {
          headers,
        });
      } catch (err) {
        return;
      }
      let html = await res.text();
      html = html.replace(/<\/script>/g, '</script>\n');

      // In webpack 5, chunks are created separately even though set entry point name.
      const chunksSrcMatches = html.matchAll(
        /src="(\/_next\/static\/chunks.+js)"/gm
      );
      const chunksSrcList = [];
      for (let [, src] of chunksSrcMatches) {
        chunksSrcList.push(src);
      }

      const srcTexts = await Promise.all(
        chunksSrcList.map((src) =>
          fetch(`http://0.0.0.0:3000${src}`, { headers }).then((res) =>
            res.text()
          )
        )
      );
      const jsText = srcTexts.join('\n');

      // polyfills-nomodule
      expect(jsText.includes('classList')).toBeTruthy();
      expect(jsText.includes('html5')).toBeTruthy();
      expect(jsText.includes('window.location.origin')).toBeTruthy();

      // polyfills-module
      expect(jsText.includes('IntersectionObserver')).toBeTruthy();
      expect(jsText.includes('matchMedia')).toBeTruthy();
      expect(jsText.includes('proxy')).toBeTruthy();
      expect(jsText.includes('requestAnimationFrame')).toBeTruthy();
      expect(jsText.includes('next-head-count')).toBeTruthy();

      done();
    })();
  },
  30 * 1000
);

afterAll(async () => {
  await fetch('http://0.0.0.0:3000/close');
});
