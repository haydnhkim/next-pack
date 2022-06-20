import path from 'path';
import url from 'url';
import { addPolyfillPlugins } from '@repacks/next-pack/src/plugins/add-polyfills-nomodule.js';
import nextTM from 'next-transpile-modules';

const withTM = nextTM(['recoil']);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
  nextPack: {
    eslint: {
      files: ['.js', '.ts', '.tsx'].map((n) =>
        path.resolve(__dirname, `src/**/*${n}`)
      ),
    },
  },
});

export default config;
