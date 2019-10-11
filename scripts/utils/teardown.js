const path = require('path');
const execa = require('execa');
const shell = require('shelljs');

// yarn remove will throw an error if you re-delete an already deleted package.
// Therefore, it is processed as a script that does not output log.
(async () => {
  try {
    await execa('yarn', ['remove', 'next', 'react', 'react-dom']);
  } catch (err) {
    console.log(err);
  }
})();

// remove generated files in dev/next-app
const nextAppDir = path.resolve(__dirname, '../../dev/next-app');
const removeTargetFiles = [];
shell.ls('-A', nextAppDir).forEach(file => {
  if (['node_modules', 'pages', 'src', 'package.json'].includes(file)) return;

  removeTargetFiles.push(path.resolve(nextAppDir, file));
});
removeTargetFiles.length && shell.rm('-rf', removeTargetFiles);
