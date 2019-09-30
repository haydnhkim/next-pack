const shell = require('shelljs');
const axios = require('axios');

test(
  'should be inserted a polyfill',
  done => {
    const child = shell.exec('yarn dev-server', function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
    child.stdout.on('data', data => {
      if (!data.includes('Ready on http')) return;

      setTimeout(async () => {
        const res = await axios.get('http://localhost:3000');

        expect(res.data).toMatch(/__NEXT_POLYFILL__/);

        child.kill();
        done();
      }, 1000);
    });
  },
  30 * 1000
);

afterAll(async () => {
  await axios.get('http://localhost:3000/close');
});
