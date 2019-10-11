import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Page = () => {
  return (
    <>
      <Head>
        <title>Main!</title>
      </Head>

      <div>Hello, Next Pack!</div>

      <div>
        <Link href="/hello?test=1">
          <a>hello page</a>
        </Link>
      </div>
    </>
  );
};

export default Page;
