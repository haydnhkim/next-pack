const { isSupportedWorkspaceRootPath } = require('./paths');
if (!process.env.NODE_ENV) {
  // @ts-ignore
  process.env.NODE_ENV = 'development';
}
const dev = process.env.NODE_ENV === 'development';

const bootstrap = (command) => {
  // for dev mode
  if (dev && command === 'dev' && isSupportedWorkspaceRootPath) {
    require('./run-eslint-activate');
    require('./copy-common-config');
    require('./upsert-gitignore');
    require('./insert-hook');
  }
};

module.exports = bootstrap;
