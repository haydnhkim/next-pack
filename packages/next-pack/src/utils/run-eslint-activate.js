const path = require('path');
const { userNextConfig } = require('./paths');

(() => {
  const { disable } = userNextConfig.nextPack.eslint || {};

  if (process.env.NODE_ENV !== 'development' || disable) return;

  const threads = require('bthreads');

  // Run eslint in worker threads
  if (threads.isMainThread) {
    const worker = new threads.Worker(
      path.resolve(__dirname, 'run-eslint.js'),
      { workerData: { isTTY: process.stdout.isTTY } }
    );

    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  }
})();
