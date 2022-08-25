#!/usr/bin/env node

// Find execute command
const args = process.argv.slice(2);
const scriptIndex = args.findIndex((x) =>
  ['start', 'dev', 'build', 'export', 'lint'].some((n) => n === x)
);
const command = scriptIndex === -1 ? args[0] || 'dev' : args[scriptIndex];

const run = () => {
  if (command === 'lint') {
    const lint = require('../src/utils/run-eslint-activate');
    lint({ isUsingCliLintCommand: true });
    return;
  }

  const defaultEnv = command === 'dev' ? 'development' : 'production';
  process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;

  // Extending next-pack's next.config.js to bootstrap
  // Call after setting NODE_ENV
  const bootstrap = require('../src/utils/bootstrap');
  bootstrap(command);

  // Run original next command
  require('next/dist/bin/next');
};

run();
