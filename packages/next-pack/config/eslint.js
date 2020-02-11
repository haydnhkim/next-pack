// plugins cannot be centralized ESLint configuration
module.exports = {
  extends: [
    require.resolve('eslint-config-react-app'),
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
