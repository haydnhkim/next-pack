// override cwd
const path = require('path');
process.chdir(path.resolve(__dirname, '..', '..'));

const next = require('@repacks/next-pack');
const express = require('express');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

module.exports = nextApp.prepare().then(() => {
  return new Promise((resolve) => {
    const app = express();

    // for test
    app.get('/close', (req, res) => {
      res.send('close');
      app.close();
      process.exit();
    });

    app.get('*', handle);

    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`⚛️  Ready on http://localhost:${PORT}`);
      resolve();
    });
  });
});
