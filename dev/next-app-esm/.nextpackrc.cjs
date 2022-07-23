const path = require('path');

module.exports = {
  eslint: {
    files: ['.js', '.ts', '.tsx'].map((n) =>
      path.resolve(__dirname, `src/**/*${n}`)
    ),
  },
};