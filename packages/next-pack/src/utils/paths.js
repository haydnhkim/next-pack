const path = require('path');
const fs = require('fs');
const findUp = require('find-up');
const projectDir = path.resolve(fs.realpathSync(process.cwd()));

const userNextConfigPath =
  findUp.sync('next.config.js', {
    cwd: projectDir,
  }) || path.resolve(projectDir, 'next.config.js');

let userNextConfig = {};
if (fs.existsSync(userNextConfigPath)) {
  userNextConfig = require(userNextConfigPath);
}
const userNextPackConfig = userNextConfig.nextPack || {};
userNextConfig.nextPack = {
  reactRefresh: true,
  ...userNextPackConfig,
  eslint: {
    restartable: 'rs',
    ...userNextPackConfig.eslint,
  },
};
const { workspaceRoot } = userNextConfig.nextPack;
const nextPackPolyfillNomodulePath = require.resolve(
  '../client/polyfills-nomodule'
);

module.exports = {
  projectDir,
  workspaceRoot,
  userNextConfig,
  nextPackPolyfillNomodulePath,
};
