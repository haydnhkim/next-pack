const bootstrap = (command) => {
  const dev =
    command === 'dev' ||
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development';
  if (!process.env.NODE_ENV && dev) process.env.NODE_ENV = 'development';

  const { userNextConfigPath } = require('./paths');
  const nextConfig = require('../../next.config');

  if (dev) {
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
};

module.exports = bootstrap;
