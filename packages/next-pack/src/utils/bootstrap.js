if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const dev = process.env.NODE_ENV === 'development';

const {
  CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL,
} = require('next/constants');
const { userNextConfigPath, nextPackPolyfillNomodulePath } = require('./paths');
const nextConfig = require('../../next.config');

const bootstrap = (command) => {
  if (dev && command === 'dev') {
    // for dev mode
    require('./run-eslint-activate');
    require('./copy-root');
    require('./copy-common-config');
    require('./upsert-gitignore');
    require('./insert-hook');
  }

  try {
    // override next.config in memory
    require.cache[require.resolve(userNextConfigPath)].exports = nextConfig;
  } catch (err) {
    require('./copy-root');

    console.info(`[\x1b[34m info \x1b[0m] created a \x1b[36mnext.config.js\x1b[0m and default configuration files for you.
Please \x1b[35mrun it again\x1b[0m.`);
    process.exit();
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
