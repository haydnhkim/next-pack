const path = require('path');
const fs = require('fs');
const findUp = require('find-up');
const { transformSync } = require('next/dist/build/swc/index');
const { getLoaderSWCOptions } = require('next/dist/build/swc/options');
const requireFromString = require('require-from-string');

const projectDir = path.resolve(fs.realpathSync(process.cwd()));

const getSwcOptions = () => {
  const swcOptions = getLoaderSWCOptions({
    filename: '',
    isServer: true,
    development: false,
  });
  swcOptions.jsc.transform.regenerator = undefined;
  const { env, jsc } = swcOptions;

  return {
    env,
    jsc,
    module: {
      type: 'commonjs',
    },
  };
};

const userNextConfigPath =
  findUp.sync('next.config.js', {
    cwd: projectDir,
  }) || path.resolve(projectDir, 'next.config.js');

let userNextConfig = {};
if (fs.existsSync(userNextConfigPath)) {
  // transform to support both cjs and esm in next.config.js file
  const code = fs.readFileSync(userNextConfigPath, 'utf-8');
  const { code: userNextConfigCode } = transformSync(code, getSwcOptions());
  userNextConfig = requireFromString(userNextConfigCode);
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
const { workspaceRoot } = userNextConfig.nextPack;
const nextPackPolyfillNomodulePath = require.resolve(
  '../client/polyfills-nomodule'
);

module.exports = {
  projectDir,
  workspaceRoot,
  userNextConfig,
  nextPackPolyfillNomodulePath,
};
