const fs = require('fs');
const path = require('path');
const { projectDir, userNextConfig } = require('./src/scripts/utils/paths');

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
  : path.resolve(__dirname, strReplacerDir);

module.exports = {
  ...userNextConfig,
  webpack(config, args) {
    const { buildId, isServer } = args;
    const polyfillsPath = `static/runtime/polyfills-next-pack-${buildId}.js`;

    const newConfig = {
      ...config,
      entry: isServer
        ? config.entry
        : async () => {
            const entries = await config.entry();

            if (!entries[polyfillsPath])
              entries[polyfillsPath] = [
                path.resolve(__dirname, 'src/client/polyfills.js'),
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
                    src: assetPrefix + "/_next/${polyfillsPath}",
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
    };

    return userNextConfig.webpack
      ? userNextConfig.webpack(newConfig, args)
      : newConfig;
  },
};
