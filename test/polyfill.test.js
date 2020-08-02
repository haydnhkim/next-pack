/**
 * @jest-environment node
 */
const path = require('path');
const shell = require('shelljs');
const fetch = require('node-fetch');

beforeEach(() => {
  shell.cp(
    path.resolve(__dirname, '../packages/next-pack/src/root/next.config.js'),
    path.resolve(__dirname, '../dev/next-app/next.config.js')
  );
});

test(
  'should be inserted a polyfill',
  done => {
    const intervalId = setInterval(async () => {
      let res;
      try {
        res = await fetch(`http://localhost:3000/_next/static/chunks/polyfills.js?ts=${Date.now()}`);
      } catch(err) {
        return;
      }
      const js = await res.text();

      if (!js.includes('polyfills')) return;

      const hasPolyfill = js.includes('next-pack/src/client');
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
