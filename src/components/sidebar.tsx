'use client';

import { useEffect, useState } from 'react';
import { ChevronsLeft, StickyNote, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { useSession } from 'next-auth/react';
import UserSettingsModal from './user-settings-modal';
import { Archive, Home, Terminal } from 'lucide-react';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import { useSidebar } from './sidebar-provider';
import { nanoid } from 'nanoid';

export default function Sidebar({ notes }: { notes?: Note[] }) {
  const pathname = usePathname();
  const session = useSession();
  const { showSidebar, setShowSidebar } = useSidebar();
  const [openNotes, setOpenNotes] = useState(false);
  const newNoteId = nanoid(7);

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  return (
    <div className='bg-white flex flex-col justify-between w-full h-[calc(100vh)] px-5 py-4'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='font-medium'>QuickNotes</h1>
          <div className='flex items-center justify-end gap-x-2'>
            <Link
              href={`/dashboard/notes`}
              aria-label='home'
              className={cn(
                'rounded-md hover:bg-gray-100 p-1.5',
                pathname === '/dashboard/notes' && 'bg-gray-100 font-medium'
              )}
            >
              <Home size={15} />
            </Link>
          </div>
        </div>
        <div>
          <div
            className={cn(
              'text-sm flex items-center cursor-pointer justify-between gap-x-2 hover:bg-gray-50 px-2 py-1.5 w-full text-start rounded-md font-medium truncate'
            )}
          >
            <div className='flex items-center justify-start gap-x-2'>
              <ChevronRight
                size={14}
                className={cn(
                  'transition-all duration-150 opacity-75 hover:opacity-100',
                  openNotes && 'rotate-90 bg-gray-50'
                )}
                onClick={() => setOpenNotes(!openNotes)}
              />
              <Link
                href={`/dashboard/notes`}
                className='flex items-center justify-start w-full gap-x-2'
              >
                <StickyNote size={12} />
                Notes
              </Link>
            </div>
            <Link
              href={`/dashboard/notes/new/${newNoteId}`}
              className='px-1.5 py-0.5 opacity-75 hover:opacity-100 bg-white rounded-md'
            >
              +
            </Link>
          </div>
          {openNotes && (
            <Link
              href={'/dashboard/notes/archived'}
              className={cn(
                'px-2 py-1.5 rounded-md pl-10 text-sm flex items-center hover:bg-gray-50 justify-start gap-x-2 w-full hover:font-medium',
                pathname.includes('archive') && 'font-medium'
              )}
            >
              <Archive size={12} />
              Archived
            </Link>
          )}
        </div>
      </div>
      <div>
        <InstallPWA />
        <a
          href='https://github.com/FrancoCanzani/notes'
          target='_blank'
          className='p-3 text-sm group flex items-center justify-between gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150'
        >
          <div className='inline-flex items-center gap-x-4'>
            <Terminal size={16} />
            Contribute
          </div>
          <span className='group-hover:block hidden'>↗</span>
        </a>
        {session.data?.user ? (
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
  );
}
