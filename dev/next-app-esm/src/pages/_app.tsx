import React from 'react';
import '@repacks/next-pack/src/client/polyfills-module';
import App from 'next/app';
import ieCorsHelper from '../utils/ie-cors-helper';

class MyApp extends App {
  componentDidMount() {
    ieCorsHelper();
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default MyApp;
