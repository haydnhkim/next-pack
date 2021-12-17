import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'utils/polyfills/polyfills-module.js',
    output: {
      file: 'packages/next-pack/src/client/polyfills-module.js',
      format: 'umd',
      name: 'polyfills-module',
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  {
    input: 'utils/polyfills/polyfills-nomodule.js',
    output: {
      file: 'packages/next-pack/src/client/polyfills-nomodule.js',
      format: 'umd',
      name: 'polyfills-nomodule',
    },
    plugins: [resolve(), commonjs(), terser()],
  },
];
