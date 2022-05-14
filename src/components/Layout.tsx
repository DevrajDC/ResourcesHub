import { NextPage } from 'next';
import React, { ReactNode } from 'react';
import { Fragment } from 'react';
import Footer from './Footer';

function Layout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <main className='min-h-[calc(100vh-60px)]'>
        {children}
      </main>
      <Footer />
    </Fragment>
  );
}

export default Layout;
