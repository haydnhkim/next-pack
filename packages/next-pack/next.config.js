const path = require('path');
const {
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS,
  CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH
} = require('next/constants');
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

            // Add more polyfills for IE9
            const polyfills = entries[CLIENT_STATIC_FILES_RUNTIME_POLYFILLS];
            if (polyfills)
              entries[CLIENT_STATIC_FILES_RUNTIME_POLYFILLS] = [
                polyfills,
                path.resolve(__dirname, 'src/client/polyfills.js'),
              ];

            // Disable react-refresh
            if (
              (
                userNextConfig.nextPack.reactRefresh === false ||
                process.env.REACT_REFRESH === 'false'
              ) &&
              CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH &&
              entries[CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH]
            )
              delete entries[CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH];

            return entries;
          },
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
