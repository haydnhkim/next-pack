#!/usr/bin/env node
const bootstrap = require('../src/utils/bootstrap');

// Find execute command
const args = process.argv.slice(2);
const scriptIndex = args.findIndex((x) =>
  ['start', 'dev', 'build', 'export'].some((n) => n === x)
);
const command = scriptIndex === -1 ? args[0] || 'dev' : args[scriptIndex];

// Extending next-pack's next.config.js to bootstrap
bootstrap(command);

// Run original next command
require('next/dist/bin/next');
