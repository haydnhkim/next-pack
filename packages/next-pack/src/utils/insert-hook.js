const path = require('path');
const fs = require('fs');
const { workspaceRoot, projectDir } = require('./paths');
const targetDir = workspaceRoot || projectDir;
const userPackageJsonPath = path.resolve(targetDir, 'package.json');
const userPackageJson = require(userPackageJsonPath);

// Add husky, lint-staged configuration to project package.json
(() => {
  // Do not add if already added or for @repacks/next-app
  if (userPackageJson.husky || userPackageJson.name === '@repacks/next-app')
    return;

  const hookConfig = {
    husky: {
      hooks: {
        'pre-commit': 'npx lint-staged',
      },
    },
    'lint-staged': {
      '*.{js,ts,tsx}': ['import-sort --write', 'prettier --write'],
      '*.{md,css,html}': ['prettier --write'],
    },
  };
  const hookConfigKeys = Object.keys(hookConfig);

  if (hookConfigKeys.every((key) => userPackageJson[key])) return;

  for (let key of hookConfigKeys) {
    userPackageJson[key] = hookConfig[key];
  }

  const newUserPackageJSon = JSON.stringify(userPackageJson, null, 2);

  if (['', '""'].some((str) => str === newUserPackageJSon.trim())) return;

  fs.writeFileSync(userPackageJsonPath, newUserPackageJSon);
})();
