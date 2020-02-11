#!/usr/bin/env node
const spawn = require('cross-spawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(x =>
  ['start', 'dev', 'build', 'export'].some(n => n === x)
);
const script = scriptIndex === -1 ? args[0] || 'dev' : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'start':
  case 'dev':
  case 'build':
  case 'export': {
    const result = spawn.sync(
      'node',
      nodeArgs
        .concat(require.resolve('../src/scripts/' + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit' }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
  default:
    console.log(`Unknown script "${script}".`);
    console.log('Perhaps you need to update next?');
    console.log(
      'See: https://github.com/zeit/next.js/blob/master/UPGRADING.md'
    );
    break;
}