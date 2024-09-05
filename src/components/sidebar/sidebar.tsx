'use client';
import React, { useState } from 'react';
import { Note } from '../../lib/types';
import SidebarNotes from './sidebar-notes';
import { Input } from '../ui/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import NewNoteDialog from '../forms/new-note-dialog';

export default function Sidebar({ notes }: { notes: Note[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='w-80 h-screen border-r border-gray-200 flex flex-col'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-xl font-semibold mb-4'>Notes</h2>
        <div className='relative mb-4 rounded-sm'>
          <Input
            type='text'
            placeholder='Search notes...'
            className='w-full pl-8 pr-2 py-1 rounded-sm'
            value={searchQuery}
            onChange={handleSearch}
          />
          <MagnifyingGlassIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        </div>
        <NewNoteDialog />
      </div>
      <SidebarNotes notes={notes} searchQuery={searchQuery} />
    </div>
  );
}
