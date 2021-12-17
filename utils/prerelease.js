const path = require('path');
const shell = require('shelljs');

const nextPackDir = path.resolve(__dirname, '../packages/next-pack');

// copy workspace root files in packages/next-pack
const copyWorkspaceRootFiles = () => {
  const copyTargetFiles = [
    '.editorconfig',
    '.eslintrc.js',
    '.gitattributes',
    '.gitignore',
    '.prettierrc.js',
    'CONTRIBUTING.md',
    'README.md',
  ];

  shell.cp(copyTargetFiles, nextPackDir);
};
copyWorkspaceRootFiles();
