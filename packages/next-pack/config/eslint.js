// plugins cannot be centralized ESLint configuration
module.exports = {
  extends: ['eslint-config-next'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
