import { addPolyfillPlugins } from '@repacks/next-pack/src/plugins/add-polyfills-nomodule.js';
import nextTM from 'next-transpile-modules';

const withTM = nextTM(['recoil']);

const config = withTM({
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
});

export default config;
