/**
 * @jest-environment node
 */
const path = require('path');
const shell = require('shelljs');
const fetch = require('node-fetch');

beforeEach(() => {
  shell.cp(
    path.resolve(__dirname, '../src/root/next.config.js'),
    path.resolve(__dirname, '../dev/next-app/next.config.js')
  );
});

test(
  'should be inserted a polyfill',
  done => {
    const intervalId = setInterval(async () => {
      let res;
      try {
        res = await fetch('http://localhost:3000');
      } catch(err) {
        return;
      }
      const html = await res.text();

      if (!html.includes('html')) return;

      const hasPolyfill = html.includes('polyfills-next-pack-');
      expect(hasPolyfill).toBeTruthy();
      if (hasPolyfill) clearInterval(intervalId);
      done();
    }, 500);
  },
  30 * 1000
);

afterAll(async () => {
  await fetch('http://localhost:3000/close');
});
