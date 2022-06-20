const path = require('path');
const {
  addPolyfillPlugins,
} = require('@repacks/next-pack/src/plugins/add-polyfills-nomodule');

module.exports = {
  webpack(config, { dev, isServer }) {
    return {
      ...config,
      plugins: [
        ...(config.plugins || []),
        ...addPolyfillPlugins({ dev, isServer }),
      ].filter(Boolean),
    };
  },
  swcMinify: true,
  nextPack: {
    eslint: {
      files: ['.js', '.ts', '.tsx'].map((n) =>
        path.resolve(__dirname, `src/**/*${n}`)
      ),
    },
  },
};
