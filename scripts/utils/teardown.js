const path = require('path');
const shell = require('shelljs');

// yarn remove will throw an error if you re-delete an already deleted package.
// Therefore, it is processed as a script that does not output log.
shell.exec('yarn remove next react react-dom', { silent: true });

// remove .someConfig files and next.config.js in dev/next-app
const nextAppDir = path.resolve(__dirname, '../../dev/next-app');
const nextAppConfigs = path.resolve(nextAppDir, '.*');
const nextConfig = path.resolve(nextAppDir, 'next.config.js');
shell.rm('-rf', [nextAppConfigs, nextConfig]);
