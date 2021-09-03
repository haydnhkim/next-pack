const path = require('path');
const { config } = require('@swc/core/spack');

module.exports = config({
  entry: path.join(__dirname, 'utils', 'polyfills', 'polyfills-nomodule.js'),
  output: {
    path: path.join(__dirname, 'packages', 'next-pack', 'src', 'client'),
    name: 'polyfills-nomodule.js',
  },
});
