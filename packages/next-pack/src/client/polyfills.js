import 'react-app-polyfill/stable';
import 'classlist-polyfill';
import 'html5shiv';
import 'intersection-observer';
import 'matchmedia-polyfill';
import 'matchmedia-polyfill/matchMedia.addListener';
import raf from 'raf';
import './location-history';
import './support-base-tag';

raf.polyfill();
