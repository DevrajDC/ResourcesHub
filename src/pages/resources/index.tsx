import React from 'react';
import Card from '../../components/Card';
import { allResources, Resource } from 'contentlayer/generated'

function Page({ resources }: {resources: Resource[]}) {
  return (
    <section className='container grid grid-cols-1 mx-auto sm:grid-cols-2 md:grid-cols-3'>
      {resources.map((el) => (
        <Card link={el.url} key={el._id} title={el.title} description={el.description} image={el.image}/>
      ))}
    </section>
  );
}

export default Page;

export async function getStaticProps() {
  return {
    props: {
      resources: allResources,
    },
  };
}
