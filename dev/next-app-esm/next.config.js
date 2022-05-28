import { addPolyfillPlugins } from '@repacks/next-pack/src/plugins/add-polyfills-nomodule.js';

const config = {
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

export default config;
