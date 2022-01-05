const path = require('path');
const shell = require('shelljs');
const nextPackFiles = require('./next-pack-files');

const removeGarbageFiles = ({ targetDir, excludes = [] }) => {
  const removeTargetFiles = [];

  shell.ls('-A', targetDir).forEach((file) => {
    if (excludes.includes(file)) return;

    removeTargetFiles.push(path.resolve(targetDir, file));
  });

  if (removeTargetFiles.length === 0) return;

  shell.rm('-rf', removeTargetFiles);
};

// remove generated files in dev/next-app
removeGarbageFiles({
  targetDir: path.resolve(__dirname, '../dev/next-app'),
  excludes: ['pages', 'src', 'next.config.js', 'package.json'],
});

// remove copied files in packages/next-pack
removeGarbageFiles({
  targetDir: path.resolve(__dirname, '../packages/next-pack'),
  excludes: nextPackFiles,
});
