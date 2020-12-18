const fs = require('fs');
const path = require('path');
const threads = require('bthreads');
const { projectDir, workspaceRoot, userNextConfig } = require('./paths');

(() => {
  if (threads.isMainThread) return;

  // forces the enabling of colorized eslint output
  // required to execute before eslint and chalk are imported
  process.argv.push('--color');

  const chokidar = require('chokidar');
  const chalk = require('chalk');
  const { dequal } = require('dequal');
  const { ESLint } = require('eslint');

  const { files } = userNextConfig.nextPack.eslint || {};
  const targetDir = workspaceRoot || projectDir;

  const userDirs = files
    ? [...new Set(files)]
    : ['src', 'pages', 'components', 'server']
        .map((dir) => path.resolve(targetDir, dir))
        .filter((dir) => fs.existsSync(dir));
  const userConfigFile = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc',
    '.eslintrc.json',
  ]
    .map((file) => path.resolve(targetDir, file))
    .find((file) => fs.existsSync(file));
  const userEsLintConfig = userConfigFile && require(userConfigFile);
  const userEsLintConfigRules = (userEsLintConfig || {}).rules || {};
  const userEsLintConfigWithoutRules = userEsLintConfig && {
    ...userEsLintConfig,
    rules: {},
  };

  const nextEsLintConfig = require('../../config/eslint.js');
  const nextEsLintConfigWithoutRules = {
    ...nextEsLintConfig,
    rules: {},
  };
  const hasCustomConfig =
    !!userEsLintConfig &&
    !dequal(userEsLintConfigWithoutRules, nextEsLintConfigWithoutRules);
  const baseConfig = hasCustomConfig
    ? userEsLintConfig
    : {
        ...nextEsLintConfig,
        rules: {
          ...nextEsLintConfig.rules,
          ...userEsLintConfigRules,
        },
      };
  const eslintUserDirs =
    files ||
    userDirs
      .map((dir) => [
        `${path.resolve(dir, '**/*.js')}`,
        `${path.resolve(dir, '**/*.ts')}`,
        `${path.resolve(dir, '**/*.tsx')}`,
      ])
      .reduce((a, b) => a.concat(b), []);
  const eslint = new ESLint({
    baseConfig,
    resolvePluginsRelativeTo: __dirname,
    errorOnUnmatchedPattern: false,
  });

  // eslint execution function
  const errors = new Map();
  let lastLintRunTime;

  const lint = async (path) => {
    // Return if rerun within 0.3 seconds
    if (Date.now() < lastLintRunTime + 300) return;

    lastLintRunTime = Date.now();
    let results;
    try {
      results = await eslint.lintFiles(path || eslintUserDirs);
    } catch (err) {
      if (hasCustomConfig) console.error(err);
      return;
    }

    // Check if the problem is resolved
    const resolvedFilePaths = new Set();
    let isPrintedError = false;
    for (let res of results) {
      const { messages, filePath } = res;
      const ruleIdValue = messages.map((n) => n.ruleId || 0).join('');

      if (messages.length) {
        if (errors.get(filePath) === ruleIdValue) isPrintedError = true;
        errors.set(filePath, ruleIdValue);
      } else {
        if (errors.has(filePath)) resolvedFilePaths.add(filePath);
        errors.delete(filePath);
      }
    }

    // Print problem resolved message
    for (let path of resolvedFilePaths.keys()) {
      threads.parentPort.postMessage(`
${chalk.underline(path)}
${chalk.green('✔︎ problem resolved!')}
`);
    }

    // Do not output if there is no message
    if (
      results.map((n) => n.messages).reduce((a, b) => a.concat(b), [])
        .length === 0
    )
      return;

    // ignore same error message
    if (isPrintedError) return;

    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    threads.parentPort.postMessage(resultText);

    return resultText;
  };

  setTimeout(() => {
    lint()
      .then(() => {})
      .catch(() => {});
  }, 100);

  const watcher = chokidar.watch(userDirs, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher.on('change', () => {
    lint()
      .then(() => {})
      .catch(() => {});
  });

  threads.parentPort.on('message', (message) => {
    if (message !== 'restart') return;

    errors.clear();
    lint()
      .then((resultText) => {
        if (resultText) return;
        threads.parentPort.postMessage(
          chalk.green('✔︎ eslint finished without any errors!')
        );
      })
      .catch(() => {});
  });
})();
