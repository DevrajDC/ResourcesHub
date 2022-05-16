import React from 'react';
import {allCategories} from "contentlayer/generated"

function Page() {
  return <div>Hello</div>;
}

export default Page;

export async function getStaticProps() {
  return {
    props: {
      resources: [],
    },
  };
}

export const getStaticPaths = async () => {
  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

