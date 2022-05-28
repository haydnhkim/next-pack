import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const title = Object.assign(
  {},
  {
    text: 'Hello, Next Pack!',
  }
);

const list = [...new Set([1, 2, 3])];

const Page = () => {
  return (
    <>
      <Head>
        <title>Main!</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>

      <div>{title.text}</div>

      <ul>
        {list.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <div>
        <Link href="/hello?test=1">
          <a>hello page</a>
        </Link>
      </div>
    </>
  );
};

export default Page;
