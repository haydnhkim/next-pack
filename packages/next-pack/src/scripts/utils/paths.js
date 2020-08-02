const path = require('path');
const fs = require('fs');
const findUp = require('find-up');
const projectDir = path.resolve(fs.realpathSync(process.cwd()));

const userNextConfigPath = findUp.sync('next.config.js', {
  cwd: projectDir,
}) || path.resolve(projectDir, 'next.config.js');

let userNextConfig = {};
if (fs.existsSync(userNextConfigPath)) {
  userNextConfig = require(userNextConfigPath);
}
userNextConfig.nextPack = userNextConfig.nextPack || {
  eslint: {},
  reactRefresh: true
};
const { workspaceRoot } = userNextConfig.nextPack;

module.exports = {
  projectDir,
  workspaceRoot,
  userNextConfigPath,
  userNextConfig,
};
