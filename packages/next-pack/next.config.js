const path = require('path');
const {
  CLIENT_STATIC_FILES_RUNTIME_MAIN,
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS,
} = require('next/constants');
const { userNextConfig } = require('./src/utils/paths');

// Check for insert polyfill
(() => {
  if (process.env.NODE_ENV === 'production') return;

  if (
    !CLIENT_STATIC_FILES_RUNTIME_MAIN ||
    !CLIENT_STATIC_FILES_RUNTIME_POLYFILLS
  ) {
    console.error(
      '[\x1b[31m %s \x1b[0m]',
      'error',
      '\x1b[31m',
      `polyfill insert failed.
Please check for new releases of next-pack or pull request to next-pack as changes have occurred in next.js.`,
      '\x1b[0m'
    );
    process.exit();
  }
})();

const addFileToEntries = (entries, target, file) => {
  let value = entries[target];

  if (value && !value.includes(file)) {
    if (!Array.isArray(value)) value = [value];
    value = [file, ...value];
  }

  return value;
};

module.exports = {
  ...userNextConfig,
  webpack(config, args) {
    const { isServer } = args;

    const newConfig = {
      ...config,
      entry: isServer
        ? config.entry
        : async () => {
            const entries = await config.entry();
            const clientPath = path.resolve(__dirname, 'src', 'client');

            // Add more polyfills for All browsers
            const main = CLIENT_STATIC_FILES_RUNTIME_MAIN;
            const polyfillsModule = path.join(
              clientPath,
              'polyfills-module.js'
            );
            entries[main] = addFileToEntries(entries, main, polyfillsModule);

            // Add more polyfills for IE9
            const polyfills = CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
            const polyfillsNoModule = path.join(
              clientPath,
              'polyfills-nomodule.js'
            );
            entries[polyfills] = addFileToEntries(
              entries,
              polyfills,
              polyfillsNoModule
            );

            return entries;
          },
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
