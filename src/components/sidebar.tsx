'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { useAuth } from '@clerk/nextjs';
import UserSettingsModal from './user-settings-modal';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import { ScrollArea } from './ui/scroll-area';
import {
  FileIcon,
  DrawingPinFilledIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import SidebarNoteOptions from './sidebar-note-options';
import { useState } from 'react';
import NewNoteForm from './new-note-form';

export default function Sidebar({ notes }: { notes?: Note[] }) {
  const [isNewNote, setIsNewNote] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const pinnedNotes = notes
    ? notes.filter((note: Note) => note.pinned === true)
    : [];

  const activeNotes = notes
    ? notes.filter(
        (note: Note) => note.status === 'active' && note.pinned != true
      )
    : [];

  return (
    <div className='bg-quarter-spanish-white-100 border-r flex flex-col justify-between w-full h-[calc(100vh)] p-5'>
      <div className='space-y-6'>
        <div className='flex flex-col space-y-2 w-full items-center justify-between'>
          <div className='flex w-full justify-between items-center space-x-2'>
            <h1 className='font-bold'>Notes</h1>
            <button
              className='rounded-md hover:bg-quarter-spanish-white-50 p-1.5 text-sm font-medium'
              onClick={() => setIsNewNote(!isNewNote)}
            >
              {isNewNote ? 'Close' : 'New'}
            </button>
          </div>
          {isNewNote && <NewNoteForm />}
        </div>
        <div>
          <ScrollArea className='h-max'>
            {pinnedNotes.map((note) => (
              <div
                key={note._id}
                className={cn(
                  'py-1.5 opacity-75 group font-medium rounded-md text-sm w-full flex items-center justify-between hover:opacity-100',
                  pathname.includes(note.id) && 'opacity-100'
                )}
              >
                <div className='flex items-center w-auto justify-start gap-x-2'>
                  <DrawingPinFilledIcon className='group-hover:hidden' />
                  <ChevronRightIcon className='group-hover:block hidden' />
                  <Link
                    href={`/notes/${note.id}`}
                    title={note.title}
                    className='truncate max-w-44 pr-2'
                  >
                    {note.title}
                  </Link>
                </div>
                <SidebarNoteOptions
                  note={note}
                  className='group-hover:visible invisible'
                />
              </div>
            ))}
            {activeNotes.map((note) => (
              <div
                key={note._id}
                className={cn(
                  'py-1.5 opacity-75 group font-medium rounded-md text-sm w-full flex items-center justify-between hover:opacity-100',
                  pathname.includes(note.id) && 'opacity-100'
                )}
              >
                <div className='flex items-center w-auto justify-start gap-x-2'>
                  <FileIcon className='group-hover:hidden' />
                  <ChevronRightIcon className='group-hover:block hidden' />
                  <Link
                    href={`/notes/${note.id}`}
                    title={note.title}
                    className='truncate max-w-44 pr-2'
                  >
                    {note.title}
                  </Link>
                </div>
                <SidebarNoteOptions
                  note={note}
                  className='group-hover:visible invisible'
                />
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className='space-y-2'>
        <InstallPWA />
        {isSignedIn ? (
          <div className='inline-flex justify-between w-full'>
            <UserSettingsModal />
          </div>
        ) : (
          <Link
            href={'/sign-in'}
            className='p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-md hover:font-medium transition-all duration-150'
          >
            <div className='inline-flex items-center gap-x-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M3 3.25c0-.966.784-1.75 1.75-1.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.25.25 0 0 0-.25.25v17.5c0 .138.112.25.25.25h5.5a.75.75 0 0 1 0 1.5h-5.5A1.75 1.75 0 0 1 3 20.75Zm9.994 9.5l3.3 3.484a.75.75 0 0 1-1.088 1.032l-4.5-4.75a.75.75 0 0 1 0-1.032l4.5-4.75a.75.75 0 0 1 1.088 1.032l-3.3 3.484h8.256a.75.75 0 0 1 0 1.5Z'
                />
              </svg>
              Sign In
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
