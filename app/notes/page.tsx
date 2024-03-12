'use client';

import Sidebar from '../components/sidebar';
import Image from 'next/image';
import getLocalStorageNotes from '../lib/helpers/get-local-storage-notes';

export default function Page() {
  const localStorageNotes = getLocalStorageNotes();
  // console.log(localStorageNotes);

  return (
    <main className='flex'>
      <Sidebar />
      <div className='flex items-center justify-center min-h-screen w-full overflow-x-hidden sm:pl-60'>
        {localStorageNotes ? (
          <div>
            {localStorageNotes.map((note) => (
              <div key={note.title}>{note.title}</div>
            ))}
          </div>
        ) : (
          <Image
            src={'/notes_app_illustration.png'}
            alt='Mingo icon'
            width={850}
            height={850}
            quality={100}
          />
        )}
      </div>
    </main>
  );
}
