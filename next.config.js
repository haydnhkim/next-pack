const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { userNextConfig } = require('./scripts/utils/paths');

// Check for insert polyfill
const replaceTargetString = `page!=='\\/_error'&&pageScript`;
(() => {
  if (process.env.NODE_ENV === 'production') return;

  const dirname = __dirname.split('node_modules')[0];
  const replaceTargetFile = path.resolve(
    dirname,
    'node_modules/next/dist/pages/_document.js'
  );
  const fileContent = fs.readFileSync(replaceTargetFile, 'utf-8');

  if (!new RegExp(replaceTargetString).test(fileContent)) {
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

            if (!entries['static/runtime/polyfill.js'])
              entries['static/runtime/polyfill.js'] = [
                path.resolve(__dirname, 'client/polyfills.js'),
              ];

            return entries;
          },
      module: {
        ...config.module,
        rules: [
          ...(config.module.rules || []),
          ...[
            {
              test: /_document\.js$/,
              loader: path.resolve(
                __dirname,
                'node_modules/string-replace-loader'
              ),
              options: {
                search: replaceTargetString,
                replace: `_react["default"].createElement("script", {
                    id: "__NEXT_POLYFILL__",
                    src: assetPrefix + "/_next/static/runtime/load-polyfill.js",
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || ${process.crossOrigin}
                  }), page !== '/_error' && pageScript`,
                flags: 'gm',
              },
            },
          ],
        ],
      },
      plugins: [
        ...(config.plugins || []),
        new CopyPlugin([
          {
            from: path.resolve(__dirname, 'client/load-polyfill.js'),
            to: 'static/runtime/load-polyfill.js',
          },
        ]),
      ],
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
