const fs = require('fs');
const { initializedPath } = require('./paths');

// initialized complete status
const isInitialized = fs.existsSync(initializedPath);

module.exports = {
  isInitialized,
};
