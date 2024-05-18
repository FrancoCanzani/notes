'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import UserSettingsModal from './user-settings-modal';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import { nanoid } from 'nanoid';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  FileIcon,
  Pencil2Icon,
  ChevronRightIcon,
  GitHubLogoIcon,
  HomeIcon,
  BackpackIcon,
} from '@radix-ui/react-icons';
import { ChevronUp } from 'lucide-react';
import SidebarNoteOptions from './sidebar-note-options';
import { useAuth } from '@clerk/nextjs';

export default function NavDrawer({ notes }: { notes?: Note[] }) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const newNoteId = nanoid(7);

  const filteredNotes = notes
    ? notes.filter((note: Note) => note.status === 'active')
    : [];

  return (
    <Drawer>
      <DrawerTrigger asChild className='sm:hidden'>
        <button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.5rem'
            height='1.5rem'
            viewBox='0 0 16 16'
          >
            <path
              fill='currentColor'
              d='M10.01 8.5c0-.276.216-.5.495-.5h2.01c.243 0 .445.183.487.412l.008.088c0 .276-.216.5-.495.5h-2.01a.5.5 0 0 1-.487-.412zM12.5 12c.25 0 .459.183.502.412l.008.088c0 .276-.228.5-.51.5H3.52a.51.51 0 0 1-.502-.412L3.01 12.5c0-.276.228-.5.51-.5h3.987V4.208l-2.06 2.06a.5.5 0 1 1-.707-.707L6.86 3.44A1.5 1.5 0 0 1 7.974 3h.033q.06 0 .118.014c.314.043.616.185.857.426l2.122 2.12a.5.5 0 0 1-.708.708l-1.889-1.89V12zM3 8.5c0-.276.216-.5.495-.5h2.01c.243 0 .445.183.487.412L6 8.5c0 .276-.216.5-.495.5h-2.01a.5.5 0 0 1-.487-.412z'
            />
          </svg>{' '}
          <span className='sr-only'>Toggle Menu</span>
        </button>
      </DrawerTrigger>
      <DrawerContent className='bg-stone-100'>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle>
              <div className='flex items-center justify-between'>
                <h1 className='font-semibold py-1.5'>QuickNotes</h1>
                <Link
                  aria-label='new note'
                  href={`/notes/${newNoteId}`}
                  className='rounded-md hover:bg-stone-200 p-1.5'
                >
                  <Pencil2Icon className='font-semibold' />
                </Link>
              </div>{' '}
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col justify-between w-full px-1.5 py-4 min-h-60'>
            <div className='space-y-6'>
              <div>
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className={cn(
                      'px-2 py-1.5 opacity-75 group font-medium rounded-md text-sm w-full flex items-center hover:bg-stone-50 justify-between hover:opacity-100',
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
                    <SidebarNoteOptions note={note} />
                  </div>
                ))}
                <hr className='my-2' />
                <Link
                  href={'/notes/archived'}
                  className={cn(
                    'px-2 py-1.5 opacity-75 font-medium rounded-md text-sm flex items-center hover:bg-stone-50 justify-start gap-x-2 w-full hover:opacity-100',
                    pathname.includes('archive') && 'opacity-100'
                  )}
                >
                  <BackpackIcon />
                  Archived
                </Link>
              </div>
            </div>
            <hr className='my-2' />
            <div className='space-y-1'>
              <InstallPWA />
              <a
                href='https://github.com/FrancoCanzani/notes'
                target='_blank'
                className={cn(
                  'px-2 py-1.5 opacity-75 group font-medium rounded-md text-sm flex items-center hover:bg-stone-50 justify-start gap-x-2 w-full hover:opacity-100'
                )}
              >
                <GitHubLogoIcon />
                Contribute
              </a>
              {isSignedIn ? (
                <UserSettingsModal />
              ) : (
                <Link
                  href={'/sign-in'}
                  className='p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150'
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
