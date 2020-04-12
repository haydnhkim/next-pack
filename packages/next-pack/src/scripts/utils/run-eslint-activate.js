const path = require('path');
const { userNextConfig } = require('./paths');

(() => {
  const { disable } = userNextConfig.nextPack.eslint || {};

  if (process.env.NODE_ENV !== 'development' || disable) return;

  const cp = require('child_process');

  // Run eslint in child process
  const worker = cp.fork(path.resolve(__dirname, 'run-eslint.js'));
  worker.on('message', console.log);
  worker.on('error', console.error);
  worker.on('exit', code => {
    if (code !== 0)
      console.error(`Worker stopped with exit code ${code}`);
  });
})();
