const path = require('path');
const fs = require('fs');
const findUp = require('find-up');
const chalk = require('chalk');

const projectDir = path.resolve(fs.realpathSync(process.cwd()));

const nextPackConfigPath =
  findUp.sync('.nextpackrc.cjs', {
    cwd: projectDir,
  }) || path.resolve(projectDir, '.nextpackrc.cjs');

let nextPackConfig = {};
if (fs.existsSync(nextPackConfigPath)) {
  try {
    nextPackConfig = require(nextPackConfigPath);
  } catch {}
}
nextPackConfig = {
  ...nextPackConfig,
  eslint: {
    restartable: 'rs',
    ...nextPackConfig.eslint,
  },
};
let { workspaceRoot, eslint } = nextPackConfig;
let isSupportedWorkspaceRootPath = true;

// Change relative path to absolute path
if (workspaceRoot && workspaceRoot.startsWith('.')) {
  const absoluteWorkspaceRootDir = path.join(
    nextPackConfigPath,
    '..',
    workspaceRoot
  );
  if (fs.existsSync(path.join(absoluteWorkspaceRootDir, 'package.json'))) {
    workspaceRoot = absoluteWorkspaceRootDir;
  } else {
    isSupportedWorkspaceRootPath = false;
    console.error(
      `⚠️  Expected a ${chalk.yellow('`package.json`')} file in ${chalk.green(
        '`workspaceRoot`'
      )}, but it doesn't exist. Please check the path again.`
    );
  }
}
if (eslint.files?.some((n) => n.startsWith('.'))) {
  eslint.files = eslint.files.map((n) =>
    (n.startsWith('.') ? path.join(nextPackConfigPath, '..', n) : n).replace(
      /\\/g,
      '/'
    )
  );
}

const nextPackPolyfillNomodulePath = require.resolve(
  '../client/polyfills-nomodule'
);

module.exports = {
  projectDir,
  workspaceRoot,
  nextPackConfig,
  nextPackPolyfillNomodulePath,
  isSupportedWorkspaceRootPath,
};
