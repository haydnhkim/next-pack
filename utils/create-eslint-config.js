const path = require('path');
const fs = require('fs');
const baseConfig = require('eslint-config-react-app/base');
const eslintConfigReactApp = require('eslint-config-react-app');

const nextPackDir = path.resolve(__dirname, '../packages/next-pack');

const checkHasConfig = (packageName) => {
  try {
    require.resolve(packageName);
    return true;
  } catch {}
  return false;
};

// create eslint config files in packages/next-pack/config
const createEsLintConfig = () => {
  const reactAppConfigRules = {};
  for (let [key, value] of Object.entries(eslintConfigReactApp.rules)) {
    if (key.startsWith('flowtype')) continue;
    reactAppConfigRules[key] = value;
  }

  // plugins cannot be centralized ESLint configuration
  const config = {
    env: baseConfig.env,
    settings: baseConfig.settings,

    rules: {
      ...baseConfig.rules,
      ...reactAppConfigRules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-uses-vars': 'warn',
      'react/jsx-uses-react': 'warn',
      'jsx-a11y/anchor-is-valid': [
        'warn',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
    },
  };
  const newConfigJson = JSON.stringify(config, null, 2);

  const configPath = '../packages/next-pack/config/eslint';
  const hasConfig = checkHasConfig(configPath);
  if (hasConfig) {
    const originConfig = require(configPath);
    if (newConfigJson === JSON.stringify(originConfig, null, 2)) return;
  }

  fs.writeFileSync(
    path.resolve(nextPackDir, 'config', 'eslint.js'),
    `module.exports = ${newConfigJson};`
  );
};
createEsLintConfig();
