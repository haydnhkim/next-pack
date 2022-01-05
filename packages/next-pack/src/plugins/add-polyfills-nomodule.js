const {
  CopyFilePlugin,
} = require('next/dist/build/webpack/plugins/copy-file-plugin');
const {
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL,
} = require('next/constants');
const chalk = require('chalk');

const addPolyfillPlugin = ({ filePath, dev, isServer }) =>
  !isServer &&
  new CopyFilePlugin({
    filePath: require.resolve(filePath),
    cacheKey: process.env.__NEXT_VERSION || '',
    name: `static/chunks/polyfills-next-pack${dev ? '' : '-[hash]'}.js`,
    minimize: false,
    info: {
      [CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL]: 1,
      minimized: true,
    },
  });

/**
 * Add nomodule polyfills.
 * @param {string[]} [filePaths] - The file paths to add
 * @param {boolean} dev - next.config.js `dev` option
 * @param {boolean} isServer - next.config.js `isServer` option
 * @returns {[CopyFilePlugin]|[]}
 */
const addPolyfillPlugins = ({ filePaths = [], dev, isServer }) => {
  if (!CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL) {
    if (!isServer)
      console.info(
        `${chalk.yellow(
          'warn'
        )}  - @repacks/next-pack: Does not support installed version of next.js.`
      );
    return [];
  }

  return ['@repacks/next-pack/src/client/polyfills-nomodule', ...filePaths]
    .map((filePath) => addPolyfillPlugin({ filePath, dev, isServer }))
    .filter(Boolean);
};

module.exports = {
  addPolyfillPlugins,
};
