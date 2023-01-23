import fs from 'fs';
import path from 'path';
import url from 'url';
import eslintConfigReactApp from 'eslint-config-react-app';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const nextPackDir = path.resolve(__dirname, '../packages/next-pack');

const checkHasConfig = async (packageName) => {
  try {
    await import(packageName);
    return true;
  } catch {}
  return false;
};

// create eslint config files in packages/next-pack/config
const createEsLintConfig = async () => {
  const reactAppConfigRules = {};
  for (let [key, value] of Object.entries(eslintConfigReactApp.rules)) {
    if (key.startsWith('flowtype')) continue;
    reactAppConfigRules[key] = value;
  }

  // plugins cannot be centralized ESLint configuration
  const config = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactAppConfigRules,
      'no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
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

  const configPath = '../packages/next-pack/config/eslint.js';
  const hasConfig = await checkHasConfig(configPath);
  if (hasConfig) {
    const { default: originConfig } = await import(configPath);
    if (newConfigJson === JSON.stringify(originConfig, null, 2)) return;
  }

  fs.writeFileSync(
    path.resolve(nextPackDir, 'config', 'eslint.js'),
    `module.exports = ${newConfigJson};`
  );
};
createEsLintConfig().then(() => {});
