const chokidar = require('chokidar');
const { workerData } = require('worker_threads');
const { lintItemStore } = require('./run-eslint');

const run = () => {
  const { userDirs } = workerData;
  const watcher = chokidar.watch(userDirs, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });
  let lastLintRunTime;

  watcher.on('change', (filePath) => {
    if (Date.now() < lastLintRunTime + 300) return;
    lastLintRunTime = Date.now();
    lintItemStore.dispatch(filePath);
  });
};

run();
