import { createServer } from 'http';
import next from '@repacks/next-pack';
import express from 'express';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

// for test
app.get('/close', (req, res) => {
  res.send('close');
  appServer.close();
  process.exit();
});

app.get('*', handle);

const appServer = createServer(app);

nextApp.prepare().then(() => {
  appServer.listen(PORT, err => {
    if (err) throw err;
    console.log(`⚛️  Ready on http://localhost:${PORT}`);
  });
});
