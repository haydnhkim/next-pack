module.exports = {
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
  ],
  plugins: ['jsx-a11y', 'you-dont-need-lodash-underscore', 'react-hooks'],
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
