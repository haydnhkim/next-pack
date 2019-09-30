const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { projectDir } = require('./paths');
const { isInitialized } = require('./state');

// Copy files in root folder to project root
(() => {
  if (isInitialized) return;

  const rootDir = path.resolve(__dirname, '../../root');

  const rootFiles = [];
  shell.ls('-A', rootDir).forEach(file => {
    // *rc.js, *config.js files are not copied if they already exist
    // The rest is always synchronized to the next-pack contents
    if (
      ['rc.js', 'config.js'].some(end => file.endsWith(end)) &&
      fs.existsSync(path.resolve(projectDir, file))
    )
      return;

    rootFiles.push(path.resolve(rootDir, file));
  });

  if (rootFiles.length === 0) return;

  shell.cp('-R', rootFiles, projectDir);
})();
