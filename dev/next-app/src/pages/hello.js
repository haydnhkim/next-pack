import React from 'react';
import Link from 'next/link';

const Page = () => (
  <div>
    <span>hello page</span>
    <br />

    <Link href="/hello">
      <a>go /hello</a>
    </Link>
    <br />
    <Link href="/hi">
      <a>go /hi tsx</a>
    </Link>
    <br />
    <Link href="/">
      <a>go home</a>
    </Link>
  </div>
);

export default Page;
