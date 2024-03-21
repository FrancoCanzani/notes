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
import calculateTimeSince from '../lib/helpers/calculate-time-since';
import NoteEditorPreview from './note-editor-preview';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import { deleteCloudNote } from '../lib/actions';
import { useSession } from 'next-auth/react';

export default function NoteCard({
  note,
  className,
}: {
  note: Note;
  className?: string;
}) {
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user?.id;

  const handleDeleteNote = async () => {
    if (note.type === 'local') {
      localStorage.removeItem(`note_${note.id}`);
      router.refresh();
      toast.success(`Deleted: ${note.title}`);
      return;
    }

    await deleteCloudNote(userId, note.id);
    router.refresh();
    toast.success(`Deleted: ${note.title}`);
  };
  return (
    <div
      key={note.id}
      className={cn(
        'p-3 rounded-md bg-amber-200 shadow-amber-300 hover:shadow-md transition-all duration-150 shadow-sm space-y-2 w-full sm:w-56 min-h-44',
        className
      )}
    >
      <div className='space-y-0.5'>
        <h3 className='font-medium text-sm'>{note.title}</h3>
        <div className='flex items-center justify-between'>
          {/* <div className='flex items-center space-x-1 justify-start'>
            <span className='text-xs text-gray-800'>
              Last edited: {calculateTimeSince(note.lastSaved)}
            </span>
          </div> */}
        </div>
      </div>
      <hr className='w-full h-[0.5px] border-gray-600 opacity-25' />
      <NoteEditorPreview
        content={note.content}
        className='block w-full no-scrollbars text-xs h-24 text-ellipsis overflow-auto whitespace-nowrap p-2 rounded-md outline-none bg-amber-50 shadow'
      />
      <div className='w-full flex items-center justify-between'>
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
              d='m18.13 12l1.26-1.26c.44-.44 1-.68 1.61-.74V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l.13-.13H5V5h7v7zM14 4.5l5.5 5.5H14zm5.13 9.33l2.04 2.04L15.04 22H13v-2.04zm3.72.36l-.98.98l-2.04-2.04l.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72'
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
          <AlertDialogContent className='bg-gray-50'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex w-full items-center justify-center space-x-6'>
              <AlertDialogCancel className='opacity-75 border-2 border-gray-100 hover:opacity-100'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteNote()}
                className='bg-amber-200 hover:bg-amber-300 duration-150 shadow-sm font-medium rounded-md py-1.5 px-3 hover:shadow-md'
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
