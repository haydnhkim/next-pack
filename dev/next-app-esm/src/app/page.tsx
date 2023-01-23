import React from 'react';
import Link from 'next/link';

const title = Object.assign(
  {},
  {
    text: 'Hello, Next Pack!',
  }
);

const list = [...Array.from(new Set([1, 2, 3]))];

const Page = () => {
  return (
    <>
      <div>{title.text}</div>

      <ul>
        {list.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <div>
        <Link href="/hello?test=1">hello page</Link>
      </div>
    </>
  );
};

export default Page;
