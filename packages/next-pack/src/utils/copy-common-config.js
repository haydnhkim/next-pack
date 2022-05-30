const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { workspaceRoot, projectDir } = require('./paths');
const targetDir = workspaceRoot || projectDir;

// Copy specific configuration files to the project root
(() => {
  const packageDir = path.resolve(__dirname, '..', '..');
  const userPackageCode = fs.readFileSync(
    path.resolve(targetDir, 'package.json'),
    'utf8'
  );
  const userPackageJson = userPackageCode ? JSON.parse(userPackageCode) : {};

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
      const userFilePath = path.resolve(targetDir, file);
      return ![
        userFilePath,
        userFilePath.replace(/\.cjs$/, '.js'),
        userFilePath.replace(/\.js$/, '.cjs'),
      ].some((filePath) => fs.existsSync(filePath));
    })
    .map((file) => {
      const filePath = path.resolve(packageDir, file);
      return userPackageJson.type !== 'module' && file.endsWith('.cjs')
        ? filePath.replace(/\.cjs$/, '.js')
        : filePath;
    });

  if (targetFiles.length === 0) return;

  shell.cp(targetFiles, targetDir);
})();
