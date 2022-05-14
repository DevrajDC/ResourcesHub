import { allResources } from 'contentlayer/generated';
import React from 'react';

function Page() {
  return <div>Hello</div>;
}

export default Page;

export async function getStaticProps() {
  return {
    props: {
      resources: allResources,
    },
  };
}


