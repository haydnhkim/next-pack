// override cwd
import express from 'express';
import path from 'path';
import url from 'url';
import next from '@repacks/next-pack';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

process.chdir(path.resolve(__dirname, '..', '..'));

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.get('*', handle);

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`⚛️  Ready on http://localhost:${PORT}`);
  });
});
