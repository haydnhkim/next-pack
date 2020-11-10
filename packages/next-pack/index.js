const bootstrap = require('./src/utils/bootstrap');
const next = require('next');

module.exports = (options) => {
  const command = options.dev ? 'dev' : 'start';

  bootstrap(command);

  return next(options);
};
