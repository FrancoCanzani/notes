'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import NoteEditorPreview from './note-editor-preview';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import { deleteCloudNote } from '../lib/actions';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { del } from 'idb-keyval';

export default function NoteCard({
  note,
  className,
  localNotes,
  setLocalNotes,
}: {
  note: Note;
  className?: string;
  localNotes: Note[];
  setLocalNotes: Dispatch<SetStateAction<Note[]>>;
}) {
  const router = useRouter();
  const session = useSession();

  const handleDeleteNote = async () => {
    if (note.type === 'local') {
      await del(note.id);
      const filtered = localNotes.filter(
        (localNote: Note) => localNote.id !== note.id
      );
      setLocalNotes(filtered);
      // refresh to refetch local notes on the sidebar
      router.refresh();
      return toast.success(`Deleted: ${note.title}`);
    } else if (session.data) {
      try {
        await deleteCloudNote(session.data.user.id, note.id);
        toast.success(`Deleted: ${note.title}`);
        router.refresh();
      } catch (error) {
        toast.error(`Failed to delete: ${note.title}`);
      }
    }
  };

  return (
    <div
      key={note.id}
      className={cn(
        'rounded-xl bg-materialBlue-100 hover:bg-materialBlue-300 hover:shadow transition-all duration-150 w-full sm:w-56 md:w-60 lg:w-64 min-h-48',
        className
      )}
    >
      <NoteEditorPreview
        content={note.content}
        className='block rounded-xl w-full no-scrollbar text-xs h-32 text-ellipsis overflow-auto whitespace-nowrap p-2 outline-none bg-materialYellow'
      />
      <h3 className={cn('font-medium rounded-t-lg p-3 truncate text-sm')}>
        {note.title}
      </h3>
      <div className='w-full p-3 flex items-center justify-between'>
        <Link
          href={
            note.type === 'local'
              ? `notes/local/${note.id}`
              : `notes/cloud/${note.id}`
          }
          className='text-xs flex items-center justify-center gap-1 opacity-75 hover:opacity-100'
        >
          Edit{' '}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='m18.13 12 1.26-1.26c.44-.44 1-.68 1.61-.74V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l.13-.13H5V5h7v7zM14 4.5 19.5 10H14zm5.13 9.33 2.04 2.04L15.04 22H13v-2.04zm3.72.36-.98.98-2.04-2.04.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72'
            />
          </svg>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger
            asChild
            className='cursor-pointer opacity-75 hover:opacity-100'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1em'
              height='1em'
              viewBox='0 0 256 256'
            >
              <path
                fill='currentColor'
                d='M216 50h-42V40a22 22 0 0 0-22-22h-48a22 22 0 0 0-22 22v10H40a6 6 0 0 0 0 12h10v146a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V62h10a6 6 0 0 0 0-12M94 40a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v10H94Zm100 168a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V62h132Zm-84-104v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0m48 0v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0'
              />
            </svg>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-gray-50 rounded-xl'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex w-full items-center justify-center space-x-6'>
              <AlertDialogCancel className='bg-gray-200 hover:opacity-90 duration-150 font-medium rounded-xl p-4'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteNote()}
                className='bg-blue-600 text-white hover:opacity-90 duration-150 font-medium rounded-xl p-4'
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
