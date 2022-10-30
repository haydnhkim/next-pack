import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'utils/polyfills/polyfills-module.js',
    output: {
      file: 'packages/next-pack/src/client/polyfills-module.js',
      format: 'umd',
      name: 'polyfills-module',
    },
    plugins: [nodeResolve(), commonjs(), terser()],
  },
  {
    input: 'utils/polyfills/polyfills-nomodule.js',
    output: {
      file: 'packages/next-pack/src/client/polyfills-nomodule.js',
      format: 'umd',
      name: 'polyfills-nomodule',
    },
    plugins: [nodeResolve(), commonjs(), terser()],
  },
];
