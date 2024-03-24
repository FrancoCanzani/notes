'use client';

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
import useLocalStorageNotes from '../lib/hooks/use-local-storage-notes';

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
        className='fixed z-20 right-5 top-4 sm:hidden opacity-70 hover:opacity-100'
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed flex flex-col overflow-y-scroll no-scrollbar justify-between space-y-10 z-10 h-full border-r border-gray-200 bg-gray-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className='space-y-5'>
          <div
            className={`flex items-center justify-start font-medium space-x-2`}
          >
            <h1 className='capitalize font-semibold'>Quick notes</h1>
          </div>
          {session.status === 'authenticated' ? (
            <AddNewNoteButton />
          ) : (
            <div className='w-full flex items-center justify-center'>
              <Link
                href={`/notes/local/new/${newNoteId}`}
                className='py-2 animate-shimmer hover:shadow-md shadow-gray-100 hover:text-white w-full text-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
              >
                Add Local Note
              </Link>
            </div>
          )}
          {pathname != '/notes' && (
            <Link
              href={'/notes'}
              className='px-3 flex items-center justify-start gap-x-3 py-2.5 w-full bg-gray-50 border shadow-gray-100 text-sm rounded-md hover:shadow-md transition-all duration-150 shadow-sm space-y-3'
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
          <div className='flex flex-col w-full space-y-4 items-center justify-start'>
            {localNotes.length > 0 && (
              <>
                <h2 className='font-medium capitalize text-start w-full'>
                  Local
                </h2>
                <div className='flex flex-col w-full space-y-2 h-52 overflow-y-scroll no-scrollbar items-center justify-start'>
                  {localNotes.map((note) => (
                    <Link
                      href={`/notes/local/${note.id}`}
                      id={note.id}
                      className={cn(
                        'px-3 py-2 w-full bg-gray-50 border shadow-gray-100 text-sm rounded-md hover:shadow-md transition-all duration-150 shadow-sm space-y-3',
                        pathname.includes(note.id) &&
                          'bg-gray-100 border-black shadow-md shadow-gray-200'
                      )}
                    >
                      <div className='flex items-center justify-between w-full'>
                        <p className='font-medium w-fit text-base truncate'>
                          {note.title}
                        </p>
                        {pathname.includes(note.id) && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1em'
                            height='1em'
                            viewBox='0 0 15 15'
                          >
                            <path
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='square'
                              d='m6.5 10.5l3-3l-3-3'
                            />
                          </svg>
                        )}
                      </div>
                      <time className='text-xs'>{note.lastSaved}</time>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {cloudNotes && cloudNotes.length > 0 && (
              <>
                <h2 className='font-medium capitalize text-start w-full'>
                  Cloud
                </h2>
                <div className='flex flex-col w-full space-y-2 h-52 overflow-y-scroll no-scrollbar items-center justify-start'>
                  {cloudNotes.map((note) => (
                    <Link
                      href={`/notes/cloud/${note.id}`}
                      key={note._id}
                      className={cn(
                        'px-3 py-2 w-full bg-gray-50 border shadow-gray-100 text-sm rounded-md hover:shadow-md transition-all duration-150 shadow-sm space-y-3',
                        pathname.includes(note.id) &&
                          'bg-gray-100 border-black shadow-md shadow-gray-200'
                      )}
                    >
                      <div className='flex items-center justify-between w-full'>
                        <p className='font-medium text-base truncate'>
                          {note.title}
                        </p>
                        {pathname.includes(note.id) && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1em'
                            height='1em'
                            viewBox='0 0 15 15'
                          >
                            <path
                              fill='none'
                              stroke='currentColor'
                              strokeLinecap='square'
                              d='m6.5 10.5l3-3l-3-3'
                            />
                          </svg>
                        )}
                      </div>
                      <time className='text-xs'>{note.lastSaved}</time>{' '}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <UserDropdown />
      </div>
    </>
  );
}
