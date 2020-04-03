import React from 'react';
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
