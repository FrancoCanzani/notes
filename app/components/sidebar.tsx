'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import UserDropdown from './user-dropdown';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import AddNewNoteButton from './add-new-note';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';
import useLocalStorageNotes from '../lib/helpers/use-local-storage-notes';

export default function Sidebar({ cloudNotes }: { cloudNotes?: Note[] }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const newNoteId = nanoid(7);

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  const localNotes = useLocalStorageNotes();

  return (
    <>
      <button
        className='fixed z-20 right-5 top-4 sm:hidden '
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed flex flex-col justify-between space-y-10 z-10 h-full border-r border-gray-200 bg-gray-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className='space-y-10'>
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
          {session.status === 'authenticated' ? (
            <AddNewNoteButton />
          ) : (
            <div className='w-full flex items-center justify-center'>
              <Link
                href={`/notes/local/new/${newNoteId}`}
                className='capitalize cursor-pointer duration-150 shadow-sm font-medium rounded-md py-1.5 px-3 hover:shadow-md bg-white w-full text-center opacity-75 hover:opacity-100'
              >
                Add Local Note
              </Link>
            </div>
          )}
          {pathname != '/notes' && (
            <Link
              href={'/notes'}
              className='flex gap-3 text-sm transition-all bg-gray-50 duration-150 shadow-sm items-center justify-start font-medium rounded-md py-1.5 px-3 hover:shadow-md'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='0.8em'
                height='0.8em'
                viewBox='0 0 16 16'
              >
                <g fill='currentColor'>
                  <path d='M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1z' />
                  <path d='M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293z' />
                </g>
              </svg>
              All notes
            </Link>
          )}
          <div className='flex flex-col w-full space-y-3 items-center justify-center'>
            {localNotes.length > 0 && (
              <div className='flex flex-col items-center w-full justify-center space-y-2'>
                <h2 className='font-medium capitalize text-start w-full'>
                  Local notes
                </h2>
                {localNotes.map((note) => (
                  <Link
                    href={`/notes/local/${note.id}`}
                    id={note.id}
                    className={cn(
                      'px-3 py-1.5 w-full bg-amber-100 font-medium shadow-amber-200 text-sm rounded-md hover:shadow-md transition-all duration-150 shadow-sm space-y-2',
                      pathname.includes(note.id) &&
                        'bg-amber-200 shadow-amber-300'
                    )}
                  >
                    {note.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col w-full space-y-3 items-center justify-center'>
            {cloudNotes && cloudNotes.length > 0 && (
              <div className='flex flex-col items-center w-full justify-center space-y-2'>
                <h2 className='font-medium capitalize text-start w-full'>
                  Cloud notes
                </h2>
                {cloudNotes.map((note) => (
                  <Link
                    href={`/notes/cloud/${note.id}`}
                    key={note._id}
                    className={cn(
                      'px-3 py-1.5 w-full bg-green-100 font-medium shadow-green-200 text-sm rounded-md hover:shadow-md transition-all duration-150 shadow-sm space-y-2',
                      pathname.includes(note.id) &&
                        'bg-green-200 shadow-green-300'
                    )}
                  >
                    {note.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <UserDropdown />
      </div>
    </>
  );
}
