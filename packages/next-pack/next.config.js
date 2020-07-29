const path = require('path');
const { CLIENT_STATIC_FILES_RUNTIME_POLYFILLS } = require('next/constants');
const { userNextConfig } = require('./src/scripts/utils/paths');

// Check for insert polyfill
(() => {
  if (process.env.NODE_ENV === 'production') return;

  if (!CLIENT_STATIC_FILES_RUNTIME_POLYFILLS) {
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

            entries[CLIENT_STATIC_FILES_RUNTIME_POLYFILLS] = [
              entries[CLIENT_STATIC_FILES_RUNTIME_POLYFILLS],
              path.resolve(__dirname, 'src/client/polyfills.js'),
            ];

            return entries;
          },
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
