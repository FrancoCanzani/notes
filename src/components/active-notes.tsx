'use client';

import NoteCard from './note-card';
import { Note } from '../lib/types';
import { useState, useEffect, useMemo } from 'react';
import { values } from 'idb-keyval';
import { cn } from '../lib/utils';
import { Grid2X2, Rows3 } from 'lucide-react';
import NoteRow from './note-row';
import NavDrawer from './nav-drawer';

export default function ActiveNotes({ cloudNotes }: { cloudNotes?: Note[] }) {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [sortingInput, setSortingInput] = useState('date');
  const [view, setView] = useState('card');

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
      <div className='flex bg-gray-100 font-medium opacity-50 items-center justify-center w-full min-h-screen'>
        <p className='text-balance text-center p-4'>
          Nothing to see here. Tap{' '}
          <strong className='underline'>New Note</strong> to start creating.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full overflow-x-hidden '>
      <div className='flex items-center justify-between px-5 pt-4 font-medium text-xl capitalize'>
        <div className='flex items-center justify-start gap-x-3'>
          <NavDrawer notes={cloudNotes} />
          <h2>Active notes</h2>
        </div>
        <div className='flex items-center justify-end gap-x-3'>
          <div
            aria-label='view'
            className='border bg-white text-xs rounded-md inline-flex justify-between'
          >
            <button
              onClick={() => setView('card')}
              disabled={view === 'card'}
              title='cards view'
              className={cn(
                'p-1.5 px-2 border rounded-l-md ring-1 ring-gray-100 font-normal',
                view === 'row' && 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              <Grid2X2 size={14} />
            </button>
            <button
              onClick={() => setView('row')}
              title='row view'
              className={cn(
                'p-1.5 px-2 border rounded-r-md ring-1 ring-gray-100 font-normal',
                view === 'card' && 'bg-gray-100 hover:bg-gray-200'
              )}
              disabled={view === 'row'}
            >
              <Rows3 size={14} />
            </button>
          </div>
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
      </div>
      {view === 'card' ? (
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
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-5 px-5 pt-3 gap-3 w-full'>
          {sortedNotes.map((note) => (
            <NoteRow
              note={note}
              key={note.id || note._id}
              localNotes={localNotes}
              setLocalNotes={setLocalNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
