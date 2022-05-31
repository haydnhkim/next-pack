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
    '.eslintrc.cjs',
    '.prettierrc.cjs',
  ]
    .filter((file) => {
      const filePath = path.resolve(packageDir, file);
      if (!fs.existsSync(filePath)) return false;
      const userFilePath = path.resolve(targetDir, file);
      return !fs.existsSync(userFilePath);
    })
    .map((file) => path.resolve(packageDir, file));

  if (targetFiles.length === 0) return;

  shell.cp(targetFiles, targetDir);
})();
