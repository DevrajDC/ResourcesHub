import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type CardProps = {
  image: string,
  title: string,
  description: string
  link: string
}

function Card({ image, title, description, link }: CardProps) {
  return (
    <div className="p-4">
      <div className="p-6 bg-gray-100 rounded-lg">
        <img className="object-cover object-center w-full mb-6 rounded h-52" src={image} alt="content" />
        <h3 className="text-xs font-medium leading-none tracking-widest text-indigo-500 ">SUBTITLE</h3>
        <h2 className="mb-4 text-lg font-medium text-gray-900">{title}</h2>
        <p className="text-base leading-relaxed">{description}</p>
        <Link href={link} passHref>
          <a className='mt-2 font-medium text-indigo-500 no-underline'>View resource</a>
        </Link>
      </div>
    </div>

  );
}

export default Card;
