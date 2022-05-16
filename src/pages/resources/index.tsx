import React, { Fragment } from 'react';
import Card from '../../components/Card';
import { allCategories, Resource, Category } from 'contentlayer/generated'

function Page({ categories }: { categories: Category[] }) {
  return (
    <section className='container px-2 py-10 mx-auto space-y-10'>
      {categories.map((el) => (
        <Row items={el.resources} key={el._id} name={el.name} />
      ))}
    </section>
  );
}

export default Page;

function Row({ items = [], name }: { items: Resource[], name: string }) {
  return (
    <section className='grid grid-cols-1 gap-5 mx-auto md:grid-cols-2 lg:grid-cols-3'>
      <h1 className='text-2xl font-bold md:text-4xl col-span-full'>{name}</h1>
      {items.map((el) => (
        <Card link={el.url} key={el._id} title={el.title} description={el.description} image={el.image} />
      ))}
    </section>
  )
}

export async function getStaticProps() {
  return {
    props: {
      categories: allCategories,
    },
  };
}
