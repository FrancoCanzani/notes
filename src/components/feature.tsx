import React from 'react';

interface FeatureProps {
  svg: React.ReactNode;
  title: string;
  description: string;
}

export default function Feature({ svg, title, description }: FeatureProps) {
  return (
    <div className='[outline:0px] border box-border no-underline relative transition-all duration-100 ease-[ease] delay-0 font-medium shadow-[rgba(0,0,0,0.02)_0px_2px_4px] m-0 p-4 rounded-md border-solid hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px] flex flex-col space-y-4 w-full items-start justify-start h-44'>
      <div className='text-black'>{svg}</div>
      <h3 className='font-medium'>{title}</h3>
      <p className='text-sm text-opaque'>{description}</p>
    </div>
  );
}
