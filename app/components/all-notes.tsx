'use client';

import getLocalStorageNotes from '../lib/helpers/get-local-storage-notes';
import NoteCard from './note-card';
import { Note } from '../lib/types';

export default function AllNotes({ cloudNotes }: { cloudNotes?: Note[] }) {
  const localStorageNotes = getLocalStorageNotes();

  if (!Array.isArray(localStorageNotes) || localStorageNotes.length === 0) {
    return (
      <div className='flex font-medium opacity-50 items-center justify-center w-full sm:pl-60 min-h-screen'>
        <p className='text-balance text-center p-4'>
          Nothing to see here. Tap{' '}
          <strong className='underline'>Add New Note</strong> to start writing.
        </p>
      </div>
    );
  }

  return (
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
          <NoteCard note={note} />
        ))}
      </div>
      <h2 className='px-5 pt-5 font-medium gap-2 flex items-center justify-start'>
        Cloud Notes
      </h2>
      <div className='flex items-start justify-start flex-wrap pb-5 px-5 pt-3 gap-3 w-full'>
        {cloudNotes &&
          cloudNotes.map((note) => (
            <NoteCard className='bg-green-300 shadow-green-300' note={note} />
          ))}
      </div>
    </div>
  );
}
