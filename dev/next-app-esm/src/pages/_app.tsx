import { useEffect } from 'react';
import '@repacks/next-pack/src/client/polyfills-module';
import type { AppProps } from 'next/app';
import ieCorsHelper from '../utils/ie-cors-helper';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    ieCorsHelper();
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
