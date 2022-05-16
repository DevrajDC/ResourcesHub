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
      <div className="p-6 bg-gray-100 rounded-lg">
        <Image width={500} height={300} src={`https://res.cloudinary.com/demo/image/fetch/${image}`} className="object-cover object-center w-full mb-6 rounded h-52"  alt="content" />
        <h2 className="mb-4 text-lg font-medium text-gray-900">{title}</h2>
        <p className="mb-2 text-base leading-relaxed">{description}</p>
        <Link href={link} passHref>
          <a className='mt-2 font-medium text-indigo-500 no-underline'>View resource</a>
        </Link>
      </div>

  );
}

export default Card;
