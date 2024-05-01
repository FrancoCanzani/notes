'use client';

import { Weblink } from '../lib/types';
import { useSidebar } from './sidebar-provider';
import { ChevronsLeft, ImageOff } from 'lucide-react';
import Image from 'next/image';

export default function Weblinks({ weblinks }: { weblinks: Weblink[] }) {
  const { showSidebar, setShowSidebar } = useSidebar();

  return (
    <div className='min-h-screen bg-gray-100 w-full overflow-x-hidden '>
      <div className='flex items-center justify-start gap-x-2 px-5 pt-4 font-medium text-xl capitalize'>
        {setShowSidebar && (
          <button
            className='rounded-md hover:bg-gray-100 px-1 py-0.5 flex items-center justify-center sm:hidden'
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <ChevronsLeft width={16} />
          </button>
        )}
        <h2>Weblinks</h2>
      </div>
      <div className='flex items-start justify-start flex-wrap pb-5 px-5 pt-3 gap-3 w-full'>
        {weblinks.map((weblink: Weblink) => (
          <div
            key={weblink.id}
            className='rounded-md text-sm space-y-2 p-2 bg-white hover:shadow border transition-all duration-150 w-full truncate sm:w-48 md:w-56 lg:w-64 flex flex-col h-52 sm:h-60'
          >
            {weblink.image ? (
              <Image
                alt={`${weblink.url} OG image`}
                width={300}
                height={300}
                src={weblink.image}
                className='rounded-md'
              />
            ) : (
              <div className='flex items-center justify-center h-[8.5rem] w-full bg-gray-50 rounded-md'>
                <Image
                  alt={`${weblink.url} OG image`}
                  width={60}
                  height={60}
                  quality={100}
                  src={`https://www.google.com/s2/favicons?domain=${weblink.url}&sz=512`}
                />
              </div>
            )}
            <h3 className='truncate font-medium' title={weblink.title}>
              {weblink.title}
            </h3>
            <p className='truncate' title={weblink.description}>
              {weblink.description}
            </p>
            <div className='flex items-center justify-start space-x-2'>
              <Image
                alt={`${weblink.url} OG image`}
                width={12}
                height={12}
                quality={100}
                src={`https://www.google.com/s2/favicons?domain=${weblink.url}&sz=512`}
              />
              <a
                href={weblink.url}
                title={weblink.url}
                className='truncate text-blue-500 hover:underline'
                target='_blank'
              >
                {weblink.url}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
