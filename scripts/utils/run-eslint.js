const fs = require('fs');
const path = require('path');

(() => {
  if (process.env.NODE_ENV !== 'development') return;

  const chokidar = require('chokidar');
  const { CLIEngine } = require('eslint');
  const { projectDir } = require('./paths');
  const userDirs = ['src', 'pages', 'components', 'server']
    .map(dir => path.resolve(projectDir, dir))
    .filter(dir => fs.existsSync(dir));
  const userConfigFile = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc',
    '.eslintrc.json',
  ]
    .map(file => path.resolve(projectDir, file))
    .find(file => fs.existsSync(file));

  const nextEsLintConfig = require(path.resolve(
    __dirname,
    '../../config/eslint.js'
  ));
  const baseConfig = {
    ...nextEsLintConfig,
    ...(userConfigFile ? require(userConfigFile) : {}),
  };
  const esLintUserDirs = userDirs.map(dir => `${path.resolve(dir, '**/*.js')}`);
  const cli = new CLIEngine({ baseConfig });

  // eslint execution function
  let lintRunTime;
  const lint = () => {
    // Return if rerun within 2 seconds
    if (Date.now() < lintRunTime + 2000) return;

    lintRunTime = Date.now();
    let report, formatter;
    try {
      report = cli.executeOnFiles(esLintUserDirs);
      formatter = cli.getFormatter();
    } catch (err) {
      return;
    }

    // Do not output if there is no message
    if (
      report.results.map(n => n.messages).reduce((a, b) => a.concat(b), [])
        .length === 0
    )
      return;

    console.log(formatter(report.results));
  };
  setTimeout(() => {
    lint();
  }, 100);

  const watcher = chokidar.watch(userDirs, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  });

  watcher.on('change', lint);
})();
