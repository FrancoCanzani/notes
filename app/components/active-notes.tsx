'use client';

import NoteCard from './note-card';
import { Note } from '../lib/types';
import { useState, useEffect, useMemo } from 'react';
import { values } from 'idb-keyval';
import { cn } from '../lib/utils';

export default function ActiveNotes({ cloudNotes }: { cloudNotes?: Note[] }) {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [sortingInput, setSortingInput] = useState('date');

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

  const filterActiveNotes = (notes: Note[]) =>
    notes.filter((note: Note) => note.status === 'active');

  const activeNotes = useMemo(
    () => filterActiveNotes([...localNotes, ...(cloudNotes || [])]),
    [localNotes, cloudNotes]
  );

  const sortedNotes =
    sortingInput === 'date'
      ? activeNotes.sort((a, b) => {
          if (new Date(a.lastSaved) > new Date(b.lastSaved)) {
            return -1;
          }
          if (new Date(a.lastSaved) < new Date(b.lastSaved)) {
            return 1;
          }
          return 0;
        })
      : activeNotes.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          return 0;
        });

  if (sortedNotes.length === 0) {
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
      <div className='flex items-center justify-between px-5 pt-4 font-medium text-xl capitalize'>
        <h2>Active notes</h2>
        <div
          aria-label='sort'
          className='border bg-white text-xs rounded-md inline-flex justify-between'
        >
          <button
            onClick={() => setSortingInput('date')}
            className={cn(
              'p-1.5 px-2 border rounded-l-md ring-1 ring-gray-100 font-normal',
              sortingInput === 'title' && 'bg-gray-100 hover:bg-gray-200'
            )}
            disabled={sortingInput === 'date'}
          >
            Date
          </button>
          <button
            onClick={() => setSortingInput('title')}
            disabled={sortingInput === 'title'}
            className={cn(
              'p-1.5 px-2 border rounded-r-md ring-1 ring-gray-100 font-normal',
              sortingInput === 'date' && 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            Title
          </button>
        </div>
      </div>
      <div className='flex items-start justify-start flex-wrap pb-5 px-5 pt-3 gap-3 w-full'>
        {sortedNotes.map((note) => (
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
