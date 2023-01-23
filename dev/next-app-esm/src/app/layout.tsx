import type { ReactNode } from 'react';
import '@repacks/next-pack/src/client/polyfills-module';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
