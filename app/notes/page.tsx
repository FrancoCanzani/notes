'use client';

import Sidebar from '../components/sidebar';
import getLocalStorageNotes from '../lib/helpers/get-local-storage-notes';
import Link from 'next/link';
import NoteEditorPreview from '../components/note-editor-preview';
import calculateTimeSince from '../lib/helpers/calculate-time-since';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const localStorageNotes = getLocalStorageNotes();
  const router = useRouter();

  if (!Array.isArray(localStorageNotes) || localStorageNotes.length === 0) {
    return (
      <div className='flex font-medium opacity-50 items-center justify-center w-full sm:pl-60 min-h-screen'>
        <p>Nothing to see here. Tap Add New Note to start writing.</p>
      </div>
    );
  }

  return (
    <main className='flex'>
      <Sidebar />
      <div className='min-h-screen w-full overflow-x-hidden sm:pl-60'>
        <h2 className='px-5 pt-4 font-medium text-xl capitalize'>
          All your notes
        </h2>
        <h2 className='px-5 pt-5 font-medium gap-2 flex items-center justify-start'>
          Local Notes{' '}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M19.8 22.6L17.15 20H6.5q-2.3 0-3.9-1.6T1 14.5q0-1.92 1.19-3.42q1.19-1.51 3.06-1.93q.08-.2.15-.39q.1-.19.15-.41L1.4 4.2l1.4-1.4l18.4 18.4M6.5 18h8.65L7.1 9.95q-.05.28-.07.55q-.03.23-.03.5h-.5q-1.45 0-2.47 1.03Q3 13.05 3 14.5q0 1.45 1.03 2.5q1.02 1 2.47 1m15.1.75l-1.45-1.4q.43-.35.64-.81q.21-.46.21-1.04q0-1.05-.73-1.77q-.72-.73-1.77-.73H17v-2q0-2.07-1.46-3.54Q14.08 6 12 6q-.67 0-1.3.16q-.63.17-1.2.52L8.05 5.23q.88-.6 1.86-.92Q10.9 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1-.37 1.81q-.38.84-1.03 1.44m-6.77-6.72'
            />
          </svg>
        </h2>
        <div className='flex items-start justify-start flex-wrap pb-5 px-5 pt-3 gap-3 w-full'>
          {localStorageNotes.map((note) => (
            <div
              key={note.key}
              className='p-3 rounded-md bg-amber-200 shadow-amber-300 hover:shadow-md transition-all duration-150 shadow-sm space-y-2 w-full sm:w-56 min-h-44'
            >
              <div className='space-y-0.5'>
                <h3 className='font-medium text-sm'>{note.title}</h3>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-1 justify-start'>
                    <span className='text-xs text-gray-800'>
                      Last edited:{' '}
                      {note.lastSaved
                        ? calculateTimeSince(note.lastSaved)
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <hr className='w-full h-[0.5px] border-gray-600 opacity-25' />
              <NoteEditorPreview
                content={note.content}
                className='block w-full no-scrollbars text-xs h-24 text-ellipsis overflow-auto whitespace-nowrap p-2 rounded-md outline-none bg-amber-50 shadow'
              />
              <div className='w-full flex items-center justify-between'>
                <Link href={`notes/${note.key}`} className='text-xs'>
                  Edit
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem(`note_${note.key}`);
                    router.refresh();
                    toast.success(`Deleted: ${note.title}`);
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1em'
                    height='1em'
                    viewBox='0 0 256 256'
                  >
                    <path
                      fill='currentColor'
                      d='M216 50h-42V40a22 22 0 0 0-22-22h-48a22 22 0 0 0-22 22v10H40a6 6 0 0 0 0 12h10v146a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V62h10a6 6 0 0 0 0-12M94 40a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v10H94Zm100 168a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V62h132Zm-84-104v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0m48 0v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0'
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
