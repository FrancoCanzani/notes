'use client';

import NoteCard from './note-card';
import { Note } from '../lib/types';
import { useState, useEffect } from 'react';
import { values } from 'idb-keyval';

export default function ArchivedNotes({ cloudNotes }: { cloudNotes?: Note[] }) {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchLocalNotes = async () => {
      try {
        const notes = await values();
        if (notes) {
          setLocalNotes(notes || []);
        }
      } catch (error) {
        console.error('Error fetching local notes from IndexedDB:', error);
      }
    };

    fetchLocalNotes();
  }, []);

  // Filter out only archived notes
  const activeNotes = [...localNotes, ...(cloudNotes || [])].filter(
    (note) => note.status === 'archived'
  );

  if (activeNotes.length === 0) {
    return (
      <div className='flex flex-col bg-gray-100 font-medium opacity-50 items-center justify-center w-full sm:pl-60 min-h-screen'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='4em'
          height='4em'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='m12 17.192l3.308-3.307l-.708-.708l-2.1 2.1v-4.7h-1v4.7l-2.1-2.1l-.708.708zM5 7.808v10.577q0 .269.173.442t.442.173h12.77q.269 0 .442-.173t.173-.442V7.808zM5.77 20q-.672 0-1.221-.549Q4 18.901 4 18.231V7.487q0-.293.093-.55q.094-.258.28-.475L5.931 4.59q.217-.292.543-.441Q6.8 4 7.174 4h9.614q.374 0 .71.149q.335.15.552.441l1.577 1.91q.186.217.28.485q.093.267.093.56V18.23q0 .67-.549 1.22q-.55.549-1.22.549zM5.38 6.808H18.6l-1.33-1.596q-.097-.097-.222-.154Q16.923 5 16.788 5H7.192q-.134 0-.26.058q-.124.057-.22.154zM12 13.404'
          />
        </svg>
        <p className='text-balance text-center p-4'>
          Your <strong className='underline'>Archived</strong> notes will be
          shown here.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gray-100 overflow-x-hidden sm:pl-60'>
      <h2 className='px-5 pt-4 font-medium text-xl capitalize'>
        Archived notes
      </h2>
      <div className='flex items-start justify-start flex-wrap pb-5 px-5 pt-3 gap-3 w-full'>
        {activeNotes.map((note) => (
          <NoteCard
            note={note}
            key={note.id || note._id}
            localNotes={localNotes}
            setLocalNotes={setLocalNotes}
          />
        ))}
      </div>
    </div>
  );
}
