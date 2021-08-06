const checkHasSortImports = () => {
  try {
    require.resolve('@trivago/prettier-plugin-sort-imports');
    return true;
  } catch {}
  return false;
};
const hasSortImports = checkHasSortImports();

module.exports = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  ...(hasSortImports && {
    importOrder: [
      'react',
      'prop-types',
      'next',
      'redux',
      'mobx',
      'recoil',
      'jotai',
      'graphql',
      'apollo',
      '^@(.*)$',
      '^[./]',
    ],
    importOrderSeparation: false,
    experimentalBabelParserPluginsList: ['jsx', 'typescript'],
  }),
};
