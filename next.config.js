const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { projectDir, userNextConfig } = require('./scripts/utils/paths');

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

// handle differently depending on where string-replace-loader is installed
const strReplacerDir = 'node_modules/string-replace-loader';
const stringReplaceLoader = fs.existsSync(
  path.resolve(projectDir, strReplacerDir)
)
  ? 'string-replace-loader'
  : path.resolve(__dirname, 'node_modules/string-replace-loader');

module.exports = {
  ...userNextConfig,
  webpack(config, args) {
    const { buildId, isServer } = args;

    const newConfig = {
      ...config,
      entry: isServer
        ? config.entry
        : async () => {
            const entries = await config.entry();

            if (!entries[`static/runtime/polyfill-${buildId}.js`])
              entries[`static/runtime/polyfill-${buildId}.js`] = [
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
              loader: stringReplaceLoader,
              options: {
                search: replaceTargetString,
                replace: `
                  _react["default"].createElement("script", {
                    id: "__NEXT_POLYFILL__",
                    src: assetPrefix + "/_next/static/runtime/polyfill-${buildId}.js",
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || ${process.crossOrigin}
                  }),
                  _react["default"].createElement("script", {
                    src: assetPrefix + "/_next/static/runtime/support-base-tag.js",
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || ${process.crossOrigin}
                  }),
                  page !== '/_error' && pageScript`,
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
            from: path.resolve(__dirname, 'client/support-base-tag.js'),
            to: 'static/runtime/support-base-tag.js',
          },
        ]),
      ],
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
