const path = require('path');
const fs = require('fs');
const findUp = require('find-up');
const { importFromStringSync } = require('module-from-string');
const chalk = require('chalk');

const projectDir = path.resolve(fs.realpathSync(process.cwd()));

const userNextConfigPath =
  findUp.sync('next.config.js', {
    cwd: projectDir,
  }) || path.resolve(projectDir, 'next.config.js');

let userNextConfig = {};
if (fs.existsSync(userNextConfigPath)) {
  // transform to support both cjs and esm in next.config.js file
  const code = fs.readFileSync(userNextConfigPath, 'utf-8');
  userNextConfig = importFromStringSync(code, {
    globals: { URL: require('url').URL },
  });
  if (userNextConfig.default) userNextConfig = userNextConfig.default;
}
const userNextPackConfig = userNextConfig.nextPack || {};
userNextConfig.nextPack = {
  reactRefresh: true,
  ...userNextPackConfig,
  eslint: {
    restartable: 'rs',
    ...userNextPackConfig.eslint,
  },
};
let { workspaceRoot, eslint } = userNextConfig.nextPack;
let isSupportedWorkspaceRootPath = true;

// esm is executed in the transpiled vm (importFromStringSync),
// so there is a problem that the path of the executable file is incorrectly specified as the path in the package.
if (
  workspaceRoot &&
  ['node_modules', '.yarn'].some((n) =>
    workspaceRoot.includes(`${path.sep}${n}${path.sep}`)
  )
) {
  isSupportedWorkspaceRootPath = false;
  console.error(
    `⚠️  Please use relative path in ${chalk.green(
      '`nextPack.workspaceRoot`'
    )} of ${chalk.yellow(
      '`next.config.js`'
    )}. esm only supports relative paths. More info: ${chalk.bold(
      'https://github.com/haydnhkim/next-pack#workspaceroot'
    )}`
  );
}

// Change relative path to absolute path
if (workspaceRoot && workspaceRoot.startsWith('.')) {
  const absoluteWorkspaceRootDir = path.join(
    userNextConfigPath,
    '..',
    workspaceRoot
  );
  if (fs.existsSync(path.join(absoluteWorkspaceRootDir, 'package.json'))) {
    workspaceRoot = absoluteWorkspaceRootDir;
  } else {
    isSupportedWorkspaceRootPath = false;
    console.error(
      `⚠️  Expected a ${chalk.yellow('`package.json`')} file in ${chalk.green(
        '`nextPack.workspaceRoot`'
      )}, but it doesn't exist. Please check the path again.`
    );
  }
}
if (eslint.files?.some((n) => n.startsWith('.'))) {
  eslint.files = eslint.files.map((n) =>
    (n.startsWith('.') ? path.join(userNextConfigPath, '..', n) : n).replace(
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
  userNextConfig,
  nextPackPolyfillNomodulePath,
  isSupportedWorkspaceRootPath,
};
