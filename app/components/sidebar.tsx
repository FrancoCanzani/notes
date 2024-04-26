'use client';

import { useEffect } from 'react';
import { ChevronsLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import AddNewNoteButton from './buttons/add-new-note';
import { useSession } from 'next-auth/react';
import UserSettingsModal from './user-settings-modal';
import { Archive, Home, Terminal } from 'lucide-react';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import { useSidebar } from './sidebar-provider';

export default function Sidebar({ notes }: { notes?: Note[] }) {
  const pathname = usePathname();
  const session = useSession();
  const { showSidebar, setShowSidebar } = useSidebar();

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  return (
    <>
      <div
        style={{ zIndex: 60 }}
        className={`transform ${
          showSidebar
            ? 'w-80 shadow sm:shadow-none sm:w-full translate-x-0'
            : '-translate-x-full'
        } fixed flex bg-white border-r flex-col overflow-y-scroll no-scrollbar justify-between space-y-10 h-full p-4 transition-all sm:w-80 sm:translate-x-0`}
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h1 className=''>QuickNotes</h1>
            <button
              className='rounded-md hover:bg-gray-100 px-1 py-0.5 flex items-center justify-center sm:hidden'
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <ChevronsLeft width={16} />
            </button>
          </div>
          <AddNewNoteButton />
          <Link
            href={`/dashboard/notes`}
            className={cn(
              'p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150',
              pathname === '/notes' && 'bg-gray-100 font-medium'
            )}
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href={'dashboard/notes/archived'}
            className={cn(
              'p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150',
              pathname.includes('archive') && 'bg-gray-100 font-medium'
            )}
          >
            <Archive size={16} />
            Archived
          </Link>
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
    </>
  );
}
