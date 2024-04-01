'use client';

import NoteCard from './note-card';
import { Note } from '../lib/types';
import { useState, useEffect } from 'react';
import { values } from 'idb-keyval';

export default function ActiveNotes({ cloudNotes }: { cloudNotes?: Note[] }) {
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

  // Filter out only active notes
  const activeNotes = [...localNotes, ...(cloudNotes || [])].filter(
    (note) => note.status === 'active'
  );

  if (activeNotes.length === 0) {
    return (
      <div className='flex bg-gray-100 font-medium opacity-50 items-center justify-center w-full sm:pl-60 min-h-screen'>
        <p className='text-balance text-center p-4'>
          Nothing to see here. Tap{' '}
          <strong className='underline'>New Note</strong> to start creating.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 w-full overflow-x-hidden sm:pl-60'>
      <h2 className='px-5 pt-4 font-medium text-xl capitalize'>Active notes</h2>
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
