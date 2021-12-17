const path = require('path');
const { readFile, writeFile } = require('fs/promises');

const polyfillsDir = path.join(
  __dirname,
  '..',
  'packages',
  'next-pack',
  'src',
  'client'
);
const polyfillsModulePath = path.join(polyfillsDir, 'polyfills-module.js');
const polyfillsNoModulePath = path.join(polyfillsDir, 'polyfills-nomodule.js');
const wrapStartString = `if (typeof window !== 'undefined') {`;
const wrapEndString = '}';

for (let file of [polyfillsModulePath, polyfillsNoModulePath]) {
  readFile(file, 'utf8')
    .then((data) => {
      if (data.startsWith(wrapStartString)) return;
      return writeFile(
        file,
        `${wrapStartString}\n${data}\n${wrapEndString}`,
        'utf8'
      );
    })
    .catch((err) => {
      console.error(err);
    });
}
