const path = require('path');
const chalk = require('chalk');
const { userNextConfig } = require('./paths');

(() => {
  const { disable, restartable } = userNextConfig.nextPack.eslint || {};

  if (process.env.NODE_ENV !== 'development' || disable) return;

  const threads = require('bthreads');

  // Run eslint in worker threads
  if (threads.isMainThread) {
    const worker = new threads.Worker(
      path.resolve(__dirname, 'run-eslint.js'),
      { workerData: { isTTY: process.stdout.isTTY } }
    );

    worker.on('message', (e) => {
      if (e.type === 'init') {
        console.info(
          chalk.yellow(`eslint restart at any time, enter \`${restartable}\``)
        );
        return;
      }
      console.log(e);
    });
    worker.on('error', console.error);
    worker.on('exit', (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });

    if (!restartable) return;

    // allow eslint to full print when the use types 'rs\n'
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      const str = data.toString().trim().toLowerCase();

      // if the keys entered match the restartable value, then restart!
      if (str === restartable) {
        worker.postMessage('restart');
      } else if (data.charCodeAt(0) === 12) {
        // ctrl+l
        console.clear();
      }
    });
  }
})();
