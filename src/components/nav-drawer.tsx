'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { useAuth } from '@clerk/nextjs';
import { Note } from '../lib/types';
import { nanoid } from 'nanoid';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveNote } from '../lib/actions';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { getContentPreview } from '@/lib/helpers/get-content-preview';

export default function NavDrawer({
  notes,
  children,
}: {
  notes?: Note[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const noteId = nanoid(7);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (userId && title.trim()) {
      toast.promise(saveNote(userId, noteId, title, ''), {
        loading: 'Saving note...',
        success: async (data) => {
          await router.push(`/notes/${noteId}`);
          setTitle('');
          return 'Note created successfully';
        },
        error: 'Error saving note',
      });
    } else if (!title.trim()) {
      toast.error('Please enter note title');
    }
  }

  const filteredNotes =
    notes?.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='bg-white'>
        <div className='mx-auto w-full'>
          <DrawerHeader className='px-4'>
            <DrawerTitle className='font-semibold py-2'>Notes</DrawerTitle>
          </DrawerHeader>
          <div className='flex flex-col w-full space-y-4'>
            <div className='px-4'>
              <div className='relative rounded-sm'>
                <Input
                  type='text'
                  placeholder='Search notes...'
                  className='w-full pl-8 pr-2 py-1 rounded-sm'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              </div>
            </div>
            <div className='px-4'>
              <form
                onSubmit={handleSubmit}
                className='flex items-center justify-between gap-x-2'
              >
                <Input
                  className='rounded-sm bg-bermuda-gray-50 border-none placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 outline-none font-medium text-sm w-full'
                  placeholder='New Note Title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  type='submit'
                  variant={'menu'}
                  size={'lg'}
                  className='px-3 py-2 h-10 rounded-sm font-medium bg-bermuda-gray-50'
                >
                  Create
                </Button>
              </form>
            </div>
            <ScrollArea className='h-[300px]'>
              {filteredNotes.map((note) => (
                <Link href={`/notes/${note.id}`} key={note.id}>
                  <div
                    className={cn(
                      'border-b border-bermuda-gray-200 hover:bg-bermuda-gray-50 cursor-pointer p-4',
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
