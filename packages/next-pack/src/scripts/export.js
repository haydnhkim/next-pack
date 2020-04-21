const bootstrap = require('./utils/bootstrap');
const cli = require('next/dist/cli/next-export');

bootstrap('export');
cli.nextExport();
