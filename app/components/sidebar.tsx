'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { LoginButton } from './log-in';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import AddNewNoteButton from './add-new-note';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';
import useLocalStorageNotes from '../lib/hooks/use-local-storage-notes';
import UserSettingsModal from './user-modal';
import { formatDistanceToNow } from 'date-fns';

export default function Sidebar({ cloudNotes }: { cloudNotes?: Note[] }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [openLocalNotes, setOpenLocalNotes] = useState(false);
  const [openCloudNotes, setOpenCloudNotes] = useState(false);
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
          showSidebar
            ? 'w-80 shadow sm:shadow-none sm:w-full translate-x-0'
            : '-translate-x-full'
        } fixed flex flex-col overflow-y-scroll no-scrollbar justify-between space-y-10 z-10 h-full p-4 transition-all sm:w-60 sm:translate-x-0 bg-materialBlue-200`}
      >
        <div className='space-y-5'>
          <div
            className={`flex items-center justify-start font-medium space-x-2`}
          >
            <h1 className='capitalize font-semibold text-xl'>QuickNotes</h1>
          </div>
          {session.status === 'authenticated' ? (
            <AddNewNoteButton />
          ) : (
            <div className='p-4 hover:shadow w-full relative flex items-center justify-center gap-x-4 rounded-xl bg-materialGreen font-medium'>
              <svg
                width='1.2rem'
                height='1.2rem'
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='absolute left-3'
              >
                <path
                  d='M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z'
                  fill='currentColor'
                  fillRule='evenodd'
                  clipRule='evenodd'
                ></path>
              </svg>{' '}
              <Link href={`/notes/local/new/${newNoteId}`}>Local Note</Link>
            </div>
          )}
          {pathname != '/notes' && (
            <Link
              href={'/notes'}
              className='p-4 flex font-medium items-center justify-center gap-x-3 w-full bg-gray-50 rounded-xl hover:shadow transition-all duration-150 space-y-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 16 16'
                className='fixed left-8'
              >
                <g fill='currentColor'>
                  <path d='M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1z' />
                  <path d='M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293z' />
                </g>
              </svg>
              All Notes
            </Link>
          )}
          <div className='flex flex-col w-full space-y-4 items-center justify-start'>
            {localNotes.length > 0 && (
              <>
                <button
                  onClick={() => setOpenLocalNotes(!openLocalNotes)}
                  className='font-medium hover:bg-gray-200 p-4 rounded-xl capitalize text-start w-full flex items-center justify-between'
                >
                  Local ({localNotes.length})
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1.5em'
                    height='1.5em'
                    viewBox='0 0 24 24'
                    className={cn('', openLocalNotes && 'rotate-90')}
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m10 17l5-5l-5-5'
                    />
                  </svg>
                </button>
                {openLocalNotes && (
                  <div className='flex flex-col w-full space-y-2 max-h-52 overflow-y-scroll no-scrollbar items-center justify-start'>
                    {localNotes.map((note) => (
                      <Link
                        href={`/notes/local/${note.id}`}
                        id={note.id}
                        key={note._id}
                        className={cn(
                          'rounded-xl space-y-1 bg-materialBlue-100 p-4 hover:bg-materialBlue-300 hover:shadow transition-all duration-150 w-full',
                          pathname.includes(note.id) && 'bg-materialBlue-300'
                        )}
                      >
                        <p className='font-medium w-fit text-base truncate'>
                          {note.title}
                        </p>
                        <time className='text-xs capitalize flex items-center justify-start gap-x-1'>
                          <svg
                            width='0.8rem'
                            height='0.8rem'
                            viewBox='0 0 15 15'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z'
                              fill='currentColor'
                              fillRule='evenodd'
                              clipRule='evenodd'
                            ></path>
                          </svg>
                          {formatDistanceToNow(new Date(note.lastSaved))}
                        </time>{' '}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
            {cloudNotes && cloudNotes.length > 0 && (
              <>
                <button
                  onClick={() => setOpenCloudNotes(!openCloudNotes)}
                  className='font-medium hover:bg-gray-200 p-4 rounded-xl capitalize text-start w-full flex items-center justify-between'
                >
                  Cloud ({cloudNotes.length})
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1.5em'
                    height='1.5em'
                    viewBox='0 0 24 24'
                    className={cn('', openCloudNotes && 'rotate-90')}
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m10 17l5-5l-5-5'
                    />
                  </svg>
                </button>
                {openCloudNotes && (
                  <div className='flex flex-col w-full space-y-2 max-h-52 overflow-y-scroll no-scrollbar items-center justify-start'>
                    {cloudNotes.map((note) => (
                      <Link
                        href={`/notes/cloud/${note.id}`}
                        key={note._id}
                        className={cn(
                          'rounded-xl bg-materialBlue-100 p-4 space-y-1 hover:bg-materialBlue-300 hover:shadow transition-all duration-150 w-full',
                          pathname.includes(note.id) && 'bg-materialBlue-300'
                        )}
                      >
                        <p className='font-medium w-fit text-base truncate'>
                          {note.title}
                        </p>
                        <time className='text-xs capitalize flex items-center justify-start gap-x-1'>
                          <svg
                            width='0.8rem'
                            height='0.8rem'
                            viewBox='0 0 15 15'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z'
                              fill='currentColor'
                              fillRule='evenodd'
                              clipRule='evenodd'
                            ></path>
                          </svg>
                          {formatDistanceToNow(new Date(note.lastSaved))}
                        </time>{' '}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {session.data?.user ? (
          <UserSettingsModal />
        ) : (
          <LoginButton className='cursor-pointer font-medium hover:bg-gray-200 p-4 rounded-xl capitalize w-full flex items-center justify-between' />
        )}
      </div>
    </>
  );
}
