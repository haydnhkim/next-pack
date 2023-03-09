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
      '^(react/(.*)$)|^(react$)',
      '^(next/(.*)$)|^(next$)',
      '^prop-types',
      '^classnames$',
      '^redux',
      '^mobx',
      '^recoil',
      '^jotai',
      '^graphql',
      '^apollo',
      '^@(.*)$',
      '<THIRD_PARTY_MODULES>',
      '^[./]',
    ],
    importOrderSeparation: false,
  }),
};
