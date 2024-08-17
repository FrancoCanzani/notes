'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import UserSettingsModal from './user-settings-modal';
import InstallPWA from './buttons/install-pwa-button';
import { Note } from '../lib/types';
import NewNoteForm from './new-note-form';
import SidebarNotes from './sidebar-notes';

export default function Sidebar({ notes }: { notes: Note[] }) {
  const { isSignedIn } = useAuth();

  return (
    <div className='bg-quarter-spanish-white-100 rounded-r-lg border-r flex flex-col justify-between w-full h-[calc(100vh)]'>
      <div className='space-y-3'>
        <div className='flex flex-col space-y-2 w-full items-center justify-between px-5 pt-5'>
          <div className='flex w-full justify-between items-center space-x-2'>
            <h1 className='font-bold'>Notes</h1>
          </div>
          <NewNoteForm />
        </div>
        <SidebarNotes notes={notes} />
      </div>
      <div className='space-y-2 px-5 pb-5'>
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
