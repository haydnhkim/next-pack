if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const dev = process.env.NODE_ENV === 'development';

const {
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL,
} = require('next/constants');
const { nextPackPolyfillNomodulePath } = require('./paths');

const bootstrap = (command) => {
  if (dev && command === 'dev') {
    // for dev mode
    require('./run-eslint-activate');
    require('./copy-common-config');
    require('./upsert-gitignore');
    require('./insert-hook');
  }

  // Add next-pack's polyfill-nomodule (for next <= v11.1.1)
  if (command === 'build' && CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL) {
    const fs = require('fs');

    try {
      const polyfillNomodulePath = require.resolve(
        'next/dist/build/polyfills/polyfill-nomodule'
      );
      const polyfillNomodule = fs.readFileSync(polyfillNomodulePath, 'utf8');
      const nextPackPolyfillNomodule = fs.readFileSync(
        nextPackPolyfillNomodulePath,
        'utf8'
      );
      fs.writeFileSync(
        polyfillNomodulePath,
        `${polyfillNomodule};${nextPackPolyfillNomodule}`,
        'utf8'
      );
    } catch {}
  }
};

module.exports = bootstrap;
