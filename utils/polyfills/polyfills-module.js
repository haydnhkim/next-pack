require('intersection-observer');
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');
require('proxy-polyfill/proxy.min');
const raf = require('raf');
require('./module/support-base-tag');

raf.polyfill();
