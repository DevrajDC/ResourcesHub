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

export const getStaticPaths = async () => {

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

