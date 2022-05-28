const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { workspaceRoot, projectDir } = require('./paths');
const targetDir = workspaceRoot || projectDir;

// Copy specific configuration files to the project root
(() => {
  const packageDir = path.resolve(__dirname, '..', '..');
  const targetFiles = [
    '.editorconfig',
    '.gitattributes',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.prettierrc.js',
    '.prettierrc.cjs',
  ]
    .filter((file) => {
      const filePath = path.resolve(packageDir, file);
      if (!fs.existsSync(filePath)) return false;

      const isJsConfigFile = [
        'rc.js',
        'rc.cjs',
        'config.js',
        'config.cjs',
      ].some((end) => file.endsWith(end));
      const userFilePath = path.resolve(targetDir, file);
      const isExistsFile = fs.existsSync(userFilePath);
      let isCopyTarget = false;

      if (isJsConfigFile) {
        // *rc.js, *config.js files are not copied if they already exist
        isCopyTarget = !isExistsFile;
      } else if (isExistsFile) {
        // Files with the same content data are not copy targets
        const fileData = fs.readFileSync(filePath, 'utf8');
        const userFileData = fs.readFileSync(userFilePath, 'utf8');
        isCopyTarget = fileData !== userFileData;
      }

      return isCopyTarget;
    })
    .map((file) => path.resolve(packageDir, file));

  if (targetFiles.length === 0) return;

  shell.cp(targetFiles, targetDir);
})();
