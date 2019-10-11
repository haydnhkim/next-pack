/**
 * @jest-environment node
 */
const execa = require('execa');
const axios = require('axios');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

test(
  'should be inserted a polyfill',
  done => {
    const child = execa('yarn', ['dev-server']);

    child.stdout.setEncoding('utf-8');
    child.stdout.on('data', async data => {
      if (!data.includes('Ready on http')) return;

      await wait(1000);
      const res = await axios.get('http://localhost:3000');

      expect(res.data).toMatch(/__NEXT_POLYFILL__/);

      child.kill();
      done();
    });
  },
  30 * 1000
);

afterAll(async () => {
  await axios.get('http://localhost:3000/close');
});
