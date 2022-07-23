import path from 'path';
import shell from 'shelljs';
import url from 'url';
import nextPackFiles from './next-pack-files.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const removeGarbageFiles = ({ targetDir, excludes = [] }) => {
  const removeTargetFiles = [];

  shell.ls('-A', targetDir).forEach((file) => {
    if (excludes.includes(file)) return;

    removeTargetFiles.push(path.resolve(targetDir, file));
  });

  if (removeTargetFiles.length === 0) return;

  shell.rm('-rf', removeTargetFiles);
};

// remove generated files in dev apps
const devAppExcludes = [
  'pages',
  'src',
  'next.config.js',
  '.nextpackrc.cjs',
  'tsconfig.json',
  'package.json',
];
removeGarbageFiles({
  targetDir: path.resolve(__dirname, '../dev/next-app'),
  excludes: devAppExcludes,
});
removeGarbageFiles({
  targetDir: path.resolve(__dirname, '../dev/next-app-esm'),
  excludes: devAppExcludes,
});

// remove copied files in packages/next-pack
removeGarbageFiles({
  targetDir: path.resolve(__dirname, '../packages/next-pack'),
  excludes: nextPackFiles,
});
