const bootstrap = require('./utils/bootstrap');
const cli = require('next/dist/cli/next-dev');

bootstrap('dev');
cli.nextDev();
