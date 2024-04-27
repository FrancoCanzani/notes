'use client';

import Sidebar from './sidebar';
import Editor from './editor/editor';
import { Note } from '../lib/types';
import { useState } from 'react';

export default function NotesProvider({
  note,
  noteId,
  notes,
}: {
  note: Note;
  noteId: string;
  notes: Note[];
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <main className='flex'>
      <Sidebar notes={notes} />
      <Editor noteId={noteId} cloudNote={note} />
    </main>
  );
}
