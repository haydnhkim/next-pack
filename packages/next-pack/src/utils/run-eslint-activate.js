const path = require('path');
const fs = require('fs');
const { Worker, isMainThread } = require('worker_threads');
const chalk = require('chalk');
const glob = require('fast-glob');
const { projectDir, workspaceRoot, nextPackConfig } = require('./paths');

const targetDir = workspaceRoot || projectDir;
const errors = new Map();
const initialState = {
  totalCount: 0,
  errorCount: 0,
  warningCount: 0,
  lintResults: [],
  resultTexts: [],
  isLinting: false,
};
const state = { ...initialState, lintResults: [], resultTexts: [] };

const checkHasPackage = (packageName) => {
  try {
    require.resolve(packageName);
    return true;
  } catch {}
  return false;
};

const checkHasEslintRule = ({ targetDir }) => {
  let lintConfigPath;
  for (const ext of ['js', 'cjs']) {
    const configPath = `${targetDir}/.eslintrc.${ext}`;
    if (checkHasPackage(configPath)) lintConfigPath = configPath;
  }
  if (!lintConfigPath) return false;
  const eslintConfig = require(lintConfigPath);
  const eslintExtends = Array.isArray(eslintConfig.extends)
    ? eslintConfig.extends
    : [eslintConfig.extends];
  const nextLintNames = ['next', 'eslint-config-next'];

  return eslintExtends.some((n) => nextLintNames.includes(n));
};

const isAbleRunEsLint =
  checkHasPackage('eslint') && checkHasEslintRule({ targetDir });

const getUserDirs = () => {
  const { files } = nextPackConfig.eslint || {};
  return files
    ? [...new Set(files)]
    : ['src', 'pages', 'components', 'server']
        .map((dir) => path.resolve(targetDir, dir))
        .filter((dir) => fs.existsSync(dir));
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const getChunkedTargetFiles = ({ userDirs }) => {
  const { files, chunkSize = 500 } = nextPackConfig.eslint || {};
  const eslintUserDirs =
    files ||
    userDirs
      .map((dir) => [
        `${path.resolve(dir, '**/*.js')}`,
        `${path.resolve(dir, '**/*.ts')}`,
        `${path.resolve(dir, '**/*.tsx')}`,
      ])
      .reduce((a, b) => a.concat(b), []);

  return chunk(glob.sync(eslintUserDirs), chunkSize);
};

const workerLintResults = ({ type, results, resultText }) => {
  if (type !== 'lint') return;

  // Decompose to sum the results of multithreading
  const [problemText, totalCount = 0, errorCount = 0, warningCount = 0] =
    /✖ (\d).+(\d) error.+(\d) warning.+$/gm.exec(resultText) || [];

  const replacedTargetDir = targetDir.endsWith(path.sep)
    ? targetDir.slice(0, -1)
    : targetDir;

  state.totalCount += Number(totalCount);
  state.errorCount += Number(errorCount);
  state.warningCount += Number(warningCount);
  state.lintResults.push(...results);
  state.resultTexts.push(
    ...resultText
      .replace(new RegExp(replacedTargetDir, 'g'), '.')
      .replace(problemText, '')
      .split('\n')
      .slice(0, -3)
  );
};

const workerLintCompleted = ({ isRestart, isUsingCliLintCommand } = {}) => {
  // Check if the problem is resolved
  const resolvedFilePaths = new Set();
  const resultText = state.resultTexts.join('\n');
  let isPrintedError = false;

  for (let res of state.lintResults) {
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
    console.info(`
${chalk.underline(path.replace(targetDir, '.'))}
${chalk.green('✔︎ problem resolved!')}
`);
  }

  if (
    state.lintResults.map((n) => n.messages).reduce((a, b) => a.concat(b), [])
      .length === 0
  ) {
    if (isRestart || isUsingCliLintCommand) {
      console.info(chalk.green('✔︎ eslint finished without any errors!'));
    }
  }

  if (!isPrintedError && resultText) {
    console.info(resultText);
    // Reformatting multithreading summation results for output
    console.info(
      chalk.yellow(
        `\n✖ ${state.totalCount} problem${1 < state.totalCount ? 's' : ''} (${
          state.errorCount
        } error${1 < state.errorCount ? 's' : ''}, ${
          state.warningCount
        } warning${1 < state.warningCount ? 's' : ''})\n`
      )
    );
  }

  if (isUsingCliLintCommand) {
    const { exit = [] } = nextPackConfig.eslint || {};
    // Exit when user sets exit rule
    if (
      (exit.includes('warning') && state.warningCount) ||
      (exit.includes('error') && state.errorCount)
    ) {
      console.error(
        chalk.red(
          '✖ eslint found some errors. Please fix them and try committing again.'
        )
      );
      process.exit(1);
      return;
    }
  }

  // The entire result is not reused and is reset to its initial value upon completion
  Object.assign(state, { ...initialState, lintResults: [], resultTexts: [] });
};

const workerExit = (code) => {
  if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
};

const runLintAllFiles = ({
  userDirs,
  userConfigFile,
  isRestart,
  isUsingCliLintCommand,
}) => {
  if (!isMainThread || !isAbleRunEsLint) return;

  const chunkedTargetFiles = getChunkedTargetFiles({ userDirs });
  let count = 0;

  for (const filePaths of chunkedTargetFiles) {
    const worker = new Worker(path.resolve(__dirname, 'run-eslint.js'), {
      workerData: {
        filePaths,
        userConfigFile,
        isRestart,
        isUsingCliLintCommand,
      },
    });

    worker.on('message', (e) => {
      workerLintResults(e);
      count += 1;
      if (count === chunkedTargetFiles.length) {
        workerLintCompleted({ isRestart, isUsingCliLintCommand });
      }
    });
    worker.on('error', console.error);
    worker.on('exit', workerExit);
  }
};

const runLintWatcher = ({
  userDirs,
  userConfigFile,
  isUsingCliLintCommand,
}) => {
  if (isUsingCliLintCommand) return;

  const worker = new Worker(path.resolve(__dirname, 'run-eslint-watcher.js'), {
    workerData: {
      userDirs,
      userConfigFile,
      isUsingCliLintCommand,
      isWatcher: true,
    },
  });

  worker.on('message', (e) => {
    workerLintResults(e);
    workerLintCompleted();
  });
  worker.on('error', console.error);
  worker.on('exit', workerExit);
};

const restartInit = ({
  userDirs,
  userConfigFile,
  restartable,
  isUsingCliLintCommand,
}) => {
  if (!restartable || isUsingCliLintCommand) return;

  console.info(
    chalk.yellow(`eslint restart at any time, enter \`${restartable}\``)
  );

  // // allow eslint to full print when the use types 'rs\n'
  // process.stdin.resume();
  // process.stdin.setEncoding('utf8');
  // process.stdin.on('data', (data) => {
  //   const str = data.toString().trim().toLowerCase();
  //
  //   // if the keys entered match the restartable value, then restart!
  //   if (str === restartable && !state.isLinting) {
  //     state.isLinting = true;
  //     errors.clear();
  //     console.info(`${chalk.cyan('wait')}  - eslint restarting...`);
  //     runLintAllFiles({
  //       userDirs,
  //       userConfigFile,
  //       isUsingCliLintCommand,
  //       isRestart: true,
  //     });
  //   } else if (data.charCodeAt(0) === 12) {
  //     // ctrl+l
  //     console.clear();
  //   }
  // });
};

const run = ({ isUsingCliLintCommand = false } = {}) => {
  const { disable, restartable } = nextPackConfig.eslint || {};

  if (
    !isMainThread ||
    !isAbleRunEsLint ||
    (!isUsingCliLintCommand && process.env.NODE_ENV !== 'development') ||
    (!isUsingCliLintCommand && disable)
  )
    return;

  const userConfigFile = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc',
    '.eslintrc.json',
  ]
    .map((file) => path.resolve(targetDir, file))
    .find((file) => fs.existsSync(file));

  // If the eslint setting exists but the extension cannot be supported
  if (
    userConfigFile &&
    !['.js', '.cjs'].some((ext) => userConfigFile.endsWith(ext))
  ) {
    console.error(
      `⚠️  Please use the ${chalk.yellow('`.eslintrc.js`')} or ${chalk.yellow(
        '`.eslintrc.cjs`'
      )}. More info: ${chalk.bold(
        'https://github.com/haydnhkim/next-pack#using-eslint'
      )}`
    );
    return;
  }

  const userDirs = getUserDirs();

  runLintAllFiles({ userDirs, userConfigFile, isUsingCliLintCommand });
  runLintWatcher({ userDirs, userConfigFile, isUsingCliLintCommand });
  restartInit({ userDirs, userConfigFile, restartable, isUsingCliLintCommand });
};

module.exports = run;
