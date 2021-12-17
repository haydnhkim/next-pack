const path = require('path');
const {
  CLIENT_STATIC_FILES_RUNTIME_MAIN,
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS,
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL,
} = require('next/constants');
const {
  userNextConfig,
  nextPackPolyfillNomodulePath,
} = require('./src/utils/paths');

// Check for insert polyfill
(() => {
  if (process.env.NODE_ENV === 'production') return;

  if (
    !CLIENT_STATIC_FILES_RUNTIME_MAIN ||
    !(
      CLIENT_STATIC_FILES_RUNTIME_POLYFILLS ||
      CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL
    )
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
    console.log({ isServer });
    const newConfig = {
      ...config,
      entry: isServer
        ? config.entry
        : async () => {
            const entries = await config.entry();
            const clientPath = path.resolve(__dirname, 'src', 'client');

            // Add more polyfills for All browsers
            const main = CLIENT_STATIC_FILES_RUNTIME_MAIN;
            console.log({ main });
            const polyfillsModule = path.join(
              clientPath,
              'polyfills-module.js'
            );
            entries[main] = addFileToEntries(entries, main, polyfillsModule);

            // Add more polyfills for IE9 (for next > v11.1.1)
            // Code for different versions: packages/next-pack/src/utils/bootstrap.js (for next <= v11.1.1)
            const polyfills = CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
            if (polyfills) {
              entries[polyfills] = addFileToEntries(
                entries,
                polyfills,
                nextPackPolyfillNomodulePath
              );
            }

            return entries;
          },
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
