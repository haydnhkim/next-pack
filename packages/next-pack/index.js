const bootstrap = require('./src/utils/bootstrap.js');
const next = require('next');

const nextPack = (options) => {
  const command = options.dev ? 'dev' : 'start';

  bootstrap(command);

  return next(options);
};

module.exports = nextPack;
