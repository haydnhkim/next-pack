const bootstrap = require('./utils/bootstrap');
const cli = require('next/dist/cli/next-build');

bootstrap('build');
cli.nextBuild();
