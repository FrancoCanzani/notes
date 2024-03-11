'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import UserDropdown from './user-dropdown';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import getAllNoteIds from '../lib/helpers/get-note-ids';

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  // the odds of repeating a specific 7-character string after 1,000 attempts are approximately 2.83%
  const newNoteId = nanoid(7);

  useEffect(() => {
    // Assuming we want to hide the sidebar when the component mounts
    setShowSidebar(false);
  }, []);

  const localNotes = getAllNoteIds();

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
          href={`/notes/new/${newNoteId}`}
          className='text-zinc-700 hover:text-zinc-600 text-center font-medium backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-4 shadow hover:shadow-zinc-400 duration-500'
        >
          New Note
        </Link>
        <div>
          {localNotes &&
            localNotes.map((note) => (
              <Link href={`/notes/${note}`} className='underline'>
                {note}
              </Link>
            ))}
        </div>
        <UserDropdown />
      </div>
    </>
  );
}
