'use client';

import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Note } from '../../lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { getContentPreview } from '@/lib/helpers/get-content-preview';

export default function SidebarNotes({
  notes,
  searchQuery,
}: {
  notes: Note[];
  searchQuery: string;
}) {
  const pathname = usePathname();

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className='flex-grow'>
      {filteredNotes.map((note) => (
        <Link href={`/notes/${note.id}`} key={note.id}>
          <div
            className={cn(
              'p-4 border-b border-bermuda-gray-200 hover:bg-bermuda-gray-50 cursor-pointer',
              pathname.includes(note.id) && 'bg-gray-50'
            )}
          >
            <div className='flex justify-between items-start mb-1'>
              <h3 className='font-medium text-sm'>{note.title}</h3>
              <span className='text-xs text-gray-500'>
                {new Date(note.lastSaved).toLocaleDateString()}
              </span>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'>
              {note.content ? getContentPreview(note.content) : ''}
            </p>
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
}
