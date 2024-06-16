'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { useAuth } from '@clerk/nextjs';
import UserSettingsModal from './user-settings-modal';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import { nanoid } from 'nanoid';
import { ScrollArea } from './ui/scroll-area';
import {
  PlusCircledIcon,
  FileIcon,
  DrawingPinFilledIcon,
  ChevronRightIcon,
  GitHubLogoIcon,
  Pencil2Icon,
  BackpackIcon,
  ExitFullScreenIcon,
  EnterFullScreenIcon,
  CrumpledPaperIcon,
} from '@radix-ui/react-icons';
import SidebarNoteOptions from './sidebar-note-options';
import useFullScreen from '../lib/hooks/use-full-screen';

export default function Sidebar({ notes }: { notes?: Note[] }) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const newNoteId = nanoid(7);
  const isFullScreen = useFullScreen();

  const pinnedNotes = notes
    ? notes.filter((note: Note) => note.pinned === true)
    : [];

  const activeNotes = notes
    ? notes.filter(
        (note: Note) => note.status === 'active' && note.pinned != true
      )
    : [];

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  return (
    <div className='bg-stone-100 border-r flex flex-col justify-between w-full h-[calc(100vh)] p-5'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <CrumpledPaperIcon className='h-4 w-4 text-neutral-600' />
            <h1 className='font-bold'>QuickNotes</h1>
          </div>
          <Link
            aria-label='new note'
            title='New note'
            href={`/notes/${newNoteId}`}
            className='rounded-md hover:bg-stone-200 p-1.5'
          >
            <Pencil2Icon className='font-semibold' />
          </Link>
        </div>
        <div>
          <ScrollArea className='h-[300px]'>
            {pinnedNotes.map((note) => (
              <div
                key={note._id}
                className={cn(
                  'px-2 py-1.5 opacity-75 group font-medium rounded-md text-sm w-full flex items-center hover:bg-stone-50 justify-between hover:opacity-100',
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
                <SidebarNoteOptions
                  note={note}
                  className='group-hover:visible invisible'
                />
              </div>
            ))}
          </ScrollArea>
          <hr className='my-2' />
          <Link
            href={'/notes/archived'}
            className={cn(
              'px-2 py-1.5 opacity-75 font-medium rounded-md text-sm flex items-center hover:bg-stone-50 justify-start gap-x-2 w-full hover:opacity-100',
              pathname.includes('archive') && 'opacity-100'
            )}
          >
            <BackpackIcon />
            Archived Notes
          </Link>
          <Link
            href={'/todos'}
            className={cn(
              'px-2 py-1.5 opacity-75 font-medium rounded-md text-sm flex items-center hover:bg-stone-50 justify-start gap-x-2 w-full hover:opacity-100',
              pathname.includes('todos') && 'opacity-100'
            )}
          >
            <PlusCircledIcon />
            Todos
          </Link>
        </div>
      </div>
      <div className='space-y-2'>
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
          <div className='inline-flex justify-between w-full'>
            <UserSettingsModal />
            <button
              onClick={toggleFullScreen}
              className='rounded-md hover:bg-stone-200 p-1.5'
              title={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
            >
              {isFullScreen ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
            </button>
          </div>
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
  );
}
