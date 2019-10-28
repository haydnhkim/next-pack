/**
 * @jest-environment node
 */
const execa = require('execa');
const fetch = require('node-fetch');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

test(
  'should be inserted a polyfill',
  done => {
    const child = execa('yarn', ['test-setting']);

    child.stdout.setEncoding('utf-8');
    child.stdout.on('data', async data => {
      if (!data.includes('Ready on http')) return;

      await wait(1000);

      let pageRes;
      try {
        const res = await fetch('http://localhost:3000', {
          method: 'GET',
        });
        pageRes = await res.text();
      } catch (err) {
        console.error('1', err);
      }

      const commonJsSrc = (/src="(\/_next\/static\/chunks\/commons[^js]+\.js)/g.exec(
        pageRes
      ) || [])[1];

      let commonJsRes;
      try {
        const res = await fetch(`http://localhost:3000${commonJsSrc}`, {
          method: 'GET',
        });
        commonJsRes = await res.text();
      } catch (err) {
        console.error('2', err);
      }

      expect(commonJsRes).toMatch(/\/_next\/static\/runtime\/polyfill\.js/);

      child.kill();
      done();
    });
  },
  30 * 1000
);

afterAll(async () => {
  await fetch('http://localhost:3000/close', {
    method: 'GET',
  });
});
