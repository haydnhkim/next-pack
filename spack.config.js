const path = require('path');
const { config } = require('@swc/core/spack');

const polyfillsDir = path.join(__dirname, 'utils', 'polyfills');

module.exports = config({
  entry: {
    'polyfills-nomodule': path.join(polyfillsDir, 'polyfills-nomodule.js'),
    'polyfills-module': path.join(polyfillsDir, 'polyfills-module.js'),
  },
  output: {
    path: path.join(__dirname, 'packages', 'next-pack', 'src', 'client'),
  },
});
