const { parentPort, workerData } = require('worker_threads');

const createLintItemStore = () => {
  const subscribers = [];

  const dispatch = (item) => {
    for (let callback of subscribers) {
      if (typeof callback !== 'function') continue;
      callback(item);
    }
  };
  const subscribe = (callback) => callback && subscribers.push(callback);

  return {
    dispatch,
    subscribe,
  };
};
const lintItemStore = createLintItemStore();

const run = () => {
  // forces the enabling of colorized eslint output
  // required to execute before eslint and chalk are imported
  process.argv.push('--color');

  const { dequal } = require('dequal');
  const { ESLint } = require('eslint');

  const userEsLintConfig =
    workerData.userConfigFile && require(workerData.userConfigFile);
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
  const eslint = new ESLint({
    baseConfig,
    resolvePluginsRelativeTo: __dirname,
    errorOnUnmatchedPattern: false,
  });

  // eslint execution function
  const lint = async (filePath) => {
    const lintTargetFilePaths = filePath ? [filePath] : workerData.filePaths;
    if (lintTargetFilePaths?.length === 0) return;

    let results;
    try {
      results = await eslint.lintFiles(lintTargetFilePaths);
    } catch (err) {
      if (hasCustomConfig) console.error(err);
      return;
    }

    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    parentPort.postMessage({
      type: 'lint',
      results,
      resultText,
    });
  };

  if (workerData.isWatcher) {
    lintItemStore.subscribe((filePath) => {
      lint(filePath)
        .then(() => {})
        .catch(() => {});
    });
  } else {
    lint()
      .then(() => {})
      .catch(() => {});
  }
};

run();

module.exports = { lintItemStore };
