const path = require('path');
const fs = require('fs');

const projectDir = path.resolve(fs.realpathSync(process.cwd()));
const userPackageJson = require(path.resolve(projectDir, 'package.json'));
const userNextConfigPath = path.resolve(projectDir, 'next.config.js');
const initializedPath = path.resolve(__dirname, '../../../initialized');

let userNextConfig = {};
if (fs.existsSync(userNextConfigPath)) {
  userNextConfig = require(userNextConfigPath);
}
userNextConfig.nextPack = userNextConfig.nextPack || {};

module.exports = {
  projectDir,
  userPackageJson,
  userNextConfigPath,
  initializedPath,
  userNextConfig,
};
