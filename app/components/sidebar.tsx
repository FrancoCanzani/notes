'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { LoginButton } from './log-in';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import AddNewNoteButton from './add-new-note';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';
import UserSettingsModal from './user-settings-modal';
import { Archive, Home, Terminal } from 'lucide-react';
import Image from 'next/image';

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
        className='fixed z-20 right-5 top-4 rounded-full p-2 sm:hidden opacity-50 hover:opacity-100'
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
            <LoginButton className='p-3 cursor-pointer text-sm group flex items-center justify-between gap-x-4 w-full rounded-md hover:bg-gray-100 hover:font-medium transition-all duration-150' />
          )}
        </div>
      </div>
    </>
  );
}
