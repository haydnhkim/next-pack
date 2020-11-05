const bootstrap = require('./src/utils/bootstrap');
const next = require('next');

module.exports = (options) => {
  const command = process.env.NODE_ENV === 'development' ? 'dev' : 'start';

  bootstrap(command);

  return next(options);
};
