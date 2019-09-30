const path = require('path');
const fs = require('fs');
const { projectDir } = require('./paths');
const { isInitialized } = require('./state');
const userPackageJSonPath = path.resolve(projectDir, 'package.json');
const userPackageJSon = require(userPackageJSonPath);

// Add husky, lint-staged configuration to project package.json
(() => {
  // Do not add if already added or for test next-app
  if (isInitialized || userPackageJSon.name === 'next-app') return;

  const hookConfig = {
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    'lint-staged': {
      '*.{js,ts}': ['import-sort --write', 'prettier --write', 'git add'],
      '*.{md,css,html}': ['prettier --write', 'git add'],
    },
  };
  const hookConfigKeys = Object.keys(hookConfig);

  if (hookConfigKeys.every(key => userPackageJSon[key])) return;

  for (let key of hookConfigKeys) {
    userPackageJSon[key] = hookConfig[key];
  }

  const newUserPackageJSon = JSON.stringify(userPackageJSon, null, 2);

  if (['', '""'].some(str => str === newUserPackageJSon.trim())) return;

  fs.writeFileSync(userPackageJSonPath, newUserPackageJSon);
})();
