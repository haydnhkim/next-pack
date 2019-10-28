const fs = require('fs');
const path = require('path');
const InjectPlugin = require('webpack-inject-plugin').default;
const { userNextConfig } = require('./scripts/utils/paths');

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

            if (!entries['static/runtime/polyfill.js'])
              entries['static/runtime/polyfill.js'] = [
                path.resolve(__dirname, 'client/polyfills.js'),
              ];

            return entries;
          },
      plugins: [
        ...(config.plugins || []),
        new InjectPlugin(() => {
          return fs.readFileSync(
            path.resolve(__dirname, 'client/load-polyfill.js'),
            'utf-8'
          );
        }),
        new InjectPlugin(() => {
          return fs.readFileSync(
            path.resolve(__dirname, 'client/support-base-tag.js'),
            'utf-8'
          );
        }),
      ],
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
