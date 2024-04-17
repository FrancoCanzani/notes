'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import AddNewNoteButton from './buttons/add-new-note';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';
import UserSettingsModal from './user-settings-modal';
import { Archive, Home, Terminal } from 'lucide-react';
import Image from 'next/image';
import InstallPWA from './buttons/install-pwa-button';

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();
  const session = useSession();
  const newNoteId = nanoid(7);

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  return (
    <>
      <button
        className='fixed z-30 right-5 bottom-12 bg-gray-50 rounded-full flex items-center justify-center h-12 w-12 sm:hidden opacity-50 hover:opacity-100'
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar
            ? 'w-80 shadow sm:shadow-none sm:w-full translate-x-0'
            : '-translate-x-full'
        } fixed flex bg-white border-r flex-col overflow-y-scroll no-scrollbar justify-between space-y-10 z-10 h-full p-4 transition-all sm:w-60 sm:translate-x-0`}
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-start'>
            <h1 className='text-xl font-bold text-black'>QuickNotes</h1>
            <Image
              src={'/thunder-icon.png'}
              alt='Logo'
              width={30}
              height={30}
            />
          </div>
          {session.status === 'authenticated' ? (
            <AddNewNoteButton />
          ) : (
            <div className='p-3 text-sm flex items-center justify-start gap-x-3 w-full rounded-md hover:bg-amber-200 hover:font-medium bg-amber-100 transition-all duration-150'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1.4em'
                height='1.4em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M8 21V7.994h13v8.583L16.577 21zm12-5h-4v4zM5.012 17.806L2.752 5.012l12.794-2.26l.504 2.863H5.618v12.083z'
                />
              </svg>{' '}
              <Link href={`/notes/local/new/${newNoteId}`}>New Note</Link>
            </div>
          )}
          <Link
            href={'/notes'}
            className={cn(
              'p-3 text-sm flex items-center justify-start gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150',
              pathname === '/notes' && 'bg-gray-100 font-medium'
            )}
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href={'/notes/archived'}
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
