/**
 * @jest-environment node
 */
const execa = require('execa');
const fetch = require('node-fetch');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

test(
  'should be inserted a polyfill',
  done => {
    const child = execa('yarn', ['dev-server']);

    child.stdout.setEncoding('utf-8');
    child.stdout.on('data', async data => {
      if (!data.includes('Ready on http')) return;

      await wait(1000);
      const res = await fetch('http://localhost:3000');
      const html = await res.text();

      expect(html).toMatch(/__NEXT_POLYFILL__/);

      child.kill();
      done();
    });
  },
  30 * 1000
);

afterAll(async () => {
  await fetch('http://localhost:3000/close');
});
