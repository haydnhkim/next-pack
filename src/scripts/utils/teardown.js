const path = require('path');
const shell = require('shelljs');

// remove generated files in dev/next-app
const nextAppDir = path.resolve(__dirname, '../../../dev/next-app');
const removeTargetFiles = [];
shell.ls('-A', nextAppDir).forEach(file => {
  if (['node_modules', 'pages', 'src', 'package.json'].includes(file)) return;

  removeTargetFiles.push(path.resolve(nextAppDir, file));
});
removeTargetFiles.length && shell.rm('-rf', removeTargetFiles);
