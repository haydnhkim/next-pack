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
};
