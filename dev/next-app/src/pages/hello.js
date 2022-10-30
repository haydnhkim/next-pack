import React from 'react';
import Link from 'next/link';

const Page = () => (
  <div>
    <span>hello page</span>
    <br />

    <Link href="/hello">go /hello</Link>
    <br />
    <Link href="/hi">go /hi tsx</Link>
    <br />
    <Link href="/">go home</Link>
  </div>
);

export default Page;
