import React from 'react';
import Link from 'next/link';

const Page = () => (
  <div>
    <span>hi page</span>
    <br />

    <Link href="/">
      <a>go home</a>
    </Link>
  </div>
);

export default Page;
