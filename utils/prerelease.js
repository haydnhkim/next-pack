const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const nextPackFiles = require('./next-pack-files');

const workspaceRootDir = path.resolve(__dirname, '../');
const nextPackDir = path.resolve(__dirname, '../packages/next-pack');

// copy workspace root files in packages/next-pack
const copyWorkspaceRootFiles = () => {
  const copyTargetFiles = [];

  shell.ls('-A', workspaceRootDir).forEach((file) => {
    const filePath = path.resolve(workspaceRootDir, file);

    if (
      nextPackFiles.includes(file) ||
      !['config', '.git', 'rc.js', '.md'].some((n) => file.includes(n)) ||
      fs.lstatSync(filePath).isDirectory()
    )
      return;

    copyTargetFiles.push(filePath);
  });

  if (copyTargetFiles.length === 0) return;

  shell.cp(copyTargetFiles, nextPackDir);
};
copyWorkspaceRootFiles();
