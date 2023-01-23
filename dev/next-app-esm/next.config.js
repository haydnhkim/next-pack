import { addPolyfillPlugins } from '@repacks/next-pack/src/plugins/add-polyfills-nomodule.js';

const config = {
  experimental: {
    appDir: true,
  },
  swcMinify: true,
  transpilePackages: ['recoil'],
  webpack(config, { dev, isServer }) {
    return {
      ...config,
      plugins: [
        ...(config.plugins || []),
        ...addPolyfillPlugins({ dev, isServer }),
      ].filter(Boolean),
    };
  },
};

export default config;
