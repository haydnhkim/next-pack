const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { projectDir } = require('./paths');

// Copy specific configuration files to the project root
(() => {
  const workspaceRootDir = path.resolve(__dirname, '../../../../../');
  const targetFiles = [
    '.editorconfig',
    '.gitattributes',
    '.eslintrc.js',
    '.importsortrc.js',
    '.prettierrc.js',
  ]
    .filter(file => {
      const isJsConfigFile = ['rc.js', 'config.js']
        .some(end => file.endsWith(end));
      const userFilePath = path.resolve(projectDir, file);
      const isExistsFile = fs.existsSync(userFilePath);
      let isCopyTarget = false;

      if (isJsConfigFile) {
        // *rc.js, *config.js files are not copied if they already exist
        isCopyTarget = !isExistsFile;
      } else if (isExistsFile) {
        // Files with the same content data are not copy targets
        const filePath = path.resolve(workspaceRootDir, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const userFileData = fs.readFileSync(userFilePath, 'utf8');
        isCopyTarget = fileData !== userFileData;
      }

      return isCopyTarget;
    })
    .map(file => path.resolve(workspaceRootDir, file));

  if (targetFiles.length === 0) return;

  shell.cp(targetFiles, projectDir);
})();
