'use client';

import Sidebar from '../components/sidebar';
import Image from 'next/image';
import getLocalStorageNotes from '../lib/helpers/get-local-storage-notes';
import Link from 'next/link';
import NoteEditorPreview from '../components/note-editor-preview';
import calculateTimeSince from '../lib/helpers/calculate-time-since';

export default function Page() {
  const localStorageNotes = getLocalStorageNotes();
  // console.log(localStorageNotes);

  function getTimeSince(dateString: string) {
    // Split the date string into parts
    const parts = dateString.split(/[ ,:]+/);

    // Parse the parts into date components
    const month = parseInt(parts[0]) - 1; // Months are zero-indexed
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const second = parseInt(parts[5]);

    // Create a new Date object
    const date = new Date(year, month, day, hour, minute, second);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInTime = currentDate.getTime() - date.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
  }

  return (
    <main className='flex'>
      <Sidebar />
      <div className='min-h-screen w-full overflow-x-hidden sm:pl-60'>
        <h2 className='px-6 pt-4 font-medium text-xl capitalize'>
          All your notes
        </h2>
        {localStorageNotes ? (
          <div className='flex items-start justify-start flex-wrap p-5 gap-3 w-full'>
            {localStorageNotes.map((note) => (
              <Link
                href={`notes/${note.key}`}
                key={note.key}
                className='p-3 rounded-md bg-amber-100 shadow-amber-200 hover:shadow-md transition-all duration-150 shadow-sm space-y-2 w-56 min-h-44'
              >
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2 justify-start'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='1em'
                        height='1em'
                        viewBox='0 0 256 256'
                      >
                        <path
                          fill='currentColor'
                          d='M230 136.49A102.12 102.12 0 1 1 119.51 26a6 6 0 0 1 1 12A90.13 90.13 0 1 0 218 135.51a6 6 0 1 1 12 1ZM122 72v56a6 6 0 0 0 6 6h56a6 6 0 0 0 0-12h-50V72a6 6 0 0 0-12 0m38-26a10 10 0 1 0-10-10a10 10 0 0 0 10 10m36 24a10 10 0 1 0-10-10a10 10 0 0 0 10 10m24 36a10 10 0 1 0-10-10a10 10 0 0 0 10 10'
                        />
                      </svg>
                      <span className='text-xs'>
                        {calculateTimeSince(note.lastSaved)}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2 justify-start'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='0.8em'
                        height='0.8em'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fill='currentColor'
                          d='M19.8 22.6L17.15 20H6.5q-2.3 0-3.9-1.6T1 14.5q0-1.92 1.19-3.42q1.19-1.51 3.06-1.93q.08-.2.15-.39q.1-.19.15-.41L1.4 4.2l1.4-1.4l18.4 18.4M6.5 18h8.65L7.1 9.95q-.05.28-.07.55q-.03.23-.03.5h-.5q-1.45 0-2.47 1.03Q3 13.05 3 14.5q0 1.45 1.03 2.5q1.02 1 2.47 1m15.1.75l-1.45-1.4q.43-.35.64-.81q.21-.46.21-1.04q0-1.05-.73-1.77q-.72-.73-1.77-.73H17v-2q0-2.07-1.46-3.54Q14.08 6 12 6q-.67 0-1.3.16q-.63.17-1.2.52L8.05 5.23q.88-.6 1.86-.92Q10.9 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1-.37 1.81q-.38.84-1.03 1.44m-6.77-6.72'
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className='font-medium'>{note.title}</h3>
                </div>
                <NoteEditorPreview
                  content={note.content}
                  className='block w-full no-scrollbars text-xs h-24 text-ellipsis overflow-auto whitespace-nowrap p-2 rounded-sm outline-none bg-amber-50 shadow'
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center w-full'>
            <Image
              src={'/notes_app_illustration.png'}
              alt='Mingo icon'
              width={850}
              height={850}
              quality={100}
              className='m-auto w-full'
            />
          </div>
        )}
      </div>
    </main>
  );
}
