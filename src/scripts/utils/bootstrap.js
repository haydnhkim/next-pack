process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const dev = process.env.NODE_ENV === 'development';
const { userNextConfigPath, initializedPath } = require('./paths');
const nextConfig = require('../../../next.config');

const bootstrap = () => {
  if (!dev) return;

  // for dev mode
  require('./run-eslint');
  require('./copy-root');
  require('./copy-common-config');
  require('./upsert-gitignore');
  require('./insert-hook');
};

(() => {
  const fs = require('fs');
  const shell = require('shelljs');

  if (!fs.existsSync(userNextConfigPath)) shell.rm('-f', initializedPath);

  bootstrap();

  try {
    // override next.config in memory
    require.cache[require.resolve(userNextConfigPath)].exports = nextConfig;
  } catch (err) {
    console.info(`[\x1b[34m info \x1b[0m] created a \x1b[36mnext.config.js\x1b[0m and default configuration files for you.
Please \x1b[35mrun it again\x1b[0m.`);
    shell.rm('-f', initializedPath);
    process.exit();
    return;
  }

  if (!dev) return;
  shell.touch(initializedPath);
})();
