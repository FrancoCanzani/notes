'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; // Assuming this icon is for opening the sidebar
import UserDropdown from './user-dropdown';
import Link from 'next/link';

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Assuming you want to hide the sidebar when the component mounts
    setShowSidebar(false);
  }, []);

  return (
    <>
      <button
        className='fixed z-20 right-5 top-4 sm:hidden' // Adjust positioning as needed
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed flex flex-col justify-between z-10 h-full border-r border-gray-200 bg-gray-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div
          className={`flex items-center justify-start font-medium space-x-2`}
        >
          <Image
            src={'/flamingo-icon.webp'}
            alt='Mingo icon'
            width={25}
            height={25}
          />
          <h1 className='capitalize font-semibold'>Flamingo quick notes</h1>
        </div>
        <Link
          href={'/'}
          className='text-zinc-700 hover:text-zinc-600 text-center font-medium backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-4 shadow hover:shadow-zinc-400 duration-500'
        >
          New File
        </Link>
        <UserDropdown />
      </div>
    </>
  );
}
