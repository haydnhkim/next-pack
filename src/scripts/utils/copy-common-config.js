const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { projectDir } = require('./paths');
const { isInitialized } = require('./state');

// Copy specific configuration files to the project root
(() => {
  if (isInitialized) return;

  const targetFiles = [
    '.editorconfig',
    '.gitattributes',
    '.eslintrc.js',
    '.importsortrc.js',
    '.prettierrc.js',
  ]
    .filter(
      file =>
        // *rc.js, *config.js files are not copied if they already exist
        !(
          ['rc.js', 'config.js'].some(end => file.endsWith(end)) &&
          fs.existsSync(path.resolve(projectDir, file))
        )
    )
    .map(file => path.resolve(__dirname, '../../../', file));

  if (targetFiles.length === 0) return;

  shell.cp(targetFiles, projectDir);
})();
