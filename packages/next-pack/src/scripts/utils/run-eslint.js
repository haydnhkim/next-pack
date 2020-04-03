const fs = require('fs');
const path = require('path');

(() => {
  const { projectDir, workspaceRoot, userNextConfig } = require('./paths');
  const { disable, files } = userNextConfig.nextPack.eslint || {};

  if (process.env.NODE_ENV !== 'development' || disable) return;

  const chokidar = require('chokidar');
  const equal = require('fast-deep-equal');
  const { CLIEngine } = require('eslint');

  const targetDir = workspaceRoot || projectDir;

  const userDirs = files
    ? [...new Set(files.map(n =>
        path.resolve(n.replace(/\*\*\/\*\..+/, ''))
      ))]
    : ['src', 'pages', 'components', 'server']
      .map(dir => path.resolve(targetDir, dir))
      .filter(dir => fs.existsSync(dir));
  const userConfigFile = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc',
    '.eslintrc.json',
  ]
    .map(file => path.resolve(targetDir, file))
    .find(file => fs.existsSync(file));
  const userEsLintConfig = userConfigFile && require(userConfigFile);
  const userEsLintConfigRules = (userEsLintConfig || {}).rules || {};
  const userEsLintConfigWithoutRules = userEsLintConfig && {
    ...userEsLintConfig,
    rules: {}
  };

  const nextEsLintConfig = require(
    '../../../config/eslint.js'
  );
  const nextEsLintConfigWithoutRules = {
    ...nextEsLintConfig,
    rules: {}
  };
  const hasCustomConfig = !!userEsLintConfig &&
    !equal(userEsLintConfigWithoutRules, nextEsLintConfigWithoutRules);
  const baseConfig = hasCustomConfig
    ? userEsLintConfig
    : {
      ...nextEsLintConfig,
      rules: {
        ...nextEsLintConfig.rules,
        ...userEsLintConfigRules,
      }
    };
  const eslintUserDirs = files ||
    userDirs
      .map(dir => [
        `${path.resolve(dir, '**/*.js')}`,
        `${path.resolve(dir, '**/*.ts')}`,
        `${path.resolve(dir, '**/*.tsx')}`
      ])
      .reduce((a, b) => a.concat(b), []);
  const cli = new CLIEngine({
    baseConfig,
    resolvePluginsRelativeTo: __dirname,
    errorOnUnmatchedPattern: false,
  });

  // eslint execution function
  let lastLintRunTime;
  let prevMessage;
  const lint = () => {
    // Return if rerun within 2 seconds
    if (Date.now() < lastLintRunTime + 2000) return;

    lastLintRunTime = Date.now();
    let report;
    let formatter = () => {};
    try {
      report = cli.executeOnFiles(eslintUserDirs);
      formatter = cli.getFormatter();
    } catch (err) {
      if (hasCustomConfig) console.error(err);
      return;
    }

    // Do not output if there is no message
    if (
      report.results.map(n => n.messages).reduce((a, b) => a.concat(b), [])
        .length === 0
    )
      return;

    const message = formatter(report.results);
    // ignore same messages
    if (message === prevMessage) return;

    prevMessage = message;
    console.log(message);
  };
  setTimeout(() => {
    lint();
  }, 100);

  const watcher = chokidar.watch(userDirs, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher.on('change', lint);
})();
