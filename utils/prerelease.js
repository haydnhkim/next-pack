import { existsSync } from 'fs';
import path from 'path';
import shell from 'shelljs';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const nextPackDir = path.resolve(__dirname, '../packages/next-pack');

// copy workspace root files in packages/next-pack
const copyWorkspaceRootFiles = () => {
  const copyTargetFiles = [
    '.editorconfig',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.gitattributes',
    '.gitignore',
    '.prettierrc.js',
    '.prettierrc.cjs',
    'CONTRIBUTING.md',
    'README.md',
  ]
    .map((fileName) => path.resolve(__dirname, '..', fileName))
    .filter((filePath) => existsSync(filePath));

  shell.cp(copyTargetFiles, nextPackDir);
};
copyWorkspaceRootFiles();
