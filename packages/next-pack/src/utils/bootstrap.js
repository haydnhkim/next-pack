if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const dev = process.env.NODE_ENV === 'development';

const bootstrap = (command) => {
  if (dev && command === 'dev') {
    // for dev mode
    require('./run-eslint-activate');
    require('./copy-common-config');
    require('./upsert-gitignore');
    require('./insert-hook');
  }
};

module.exports = bootstrap;
