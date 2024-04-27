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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { formatDistanceToNowStrict } from 'date-fns';
import { Button } from './ui/button';
import NoteEditorPreview from './note-editor-preview';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import { deleteCloudNote, updateNoteStatus } from '../lib/actions';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { del, set } from 'idb-keyval';
import { MoreVertical, FileClock } from 'lucide-react';
import LabelInput from './label-input';

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
      toast.success(`Deleted: ${note.title}`);
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

  const handleChangeStatus = async () => {
    let newStatus: 'active' | 'archived' = 'active';

    try {
      if (note.type === 'local') {
        newStatus = note.status === 'active' ? 'archived' : 'active';
        const updatedNote: Note = {
          ...note,
          status: newStatus,
        };
        await set(note.id, updatedNote);
        const updatedLocalNotes = localNotes.map((n) =>
          n.id === note.id ? updatedNote : n
        );
        setLocalNotes(updatedLocalNotes);
      } else if (session.data) {
        newStatus = note.status === 'active' ? 'archived' : 'active';
        await updateNoteStatus(session.data.user.id, note.id, newStatus);
      }
      toast.success(
        `${newStatus === 'archived' ? 'Archived' : 'Restored'}: ${note.title}`
      );
      router.refresh();
    } catch (error) {
      toast.error(`Failed to change status: ${note.title}`);
    }
  };

  return (
    <div
      className={cn(
        'rounded-md p-2 bg-white hover:shadow border transition-all duration-150 w-full truncate sm:w-56 md:w-60 lg:w-64 flex flex-col h-52 sm:h-60'
      )}
    >
      <div className='flex items-center justify-between'>
        <h3
          className={cn('font-medium rounded-t-lg truncate text-xs pr-2')}
          title={note.title}
        >
          {note.title}
        </h3>
        <div className='flex items-center justify-end gap-x-0.5'>
          {note.type === 'local' ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1em'
              height='1em'
              viewBox='0 0 14 14'
            >
              <g
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M5.82 1.953H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V7.234M6 10.953l-1 2.5m3-2.5l1 2.5m-5 0h6' />
                <path d='M13.43 5.112c0 .24-.195.435-.435.435h-4.77a.435.435 0 0 1-.434-.435V.982a.435.435 0 0 1 .435-.435H9.83a.435.435 0 0 1 .435.33l.122.54h2.608a.435.435 0 0 1 .435.434z' />
              </g>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1.2em'
              height='1.2em'
              viewBox='0 0 512 512'
            >
              <path
                d='M288 124c30.3 0 59.3 11.2 81.8 31.5 22.3 20.1 36.3 47.6 39.5 77.3l1.2 11.1c.6 5.8 5 10.5 10.7 11.5l11 2c14 2.5 27 10.4 36.7 22.1 9.8 12 15.2 26.9 15.2 42.1 0 17-6.9 34.1-18.9 46.8C453 381 437.4 388 421.1 388H90.9c-16.3 0-31.9-7-43.9-19.7s-18.9-29.7-18.9-46.8c0-14.4 4.6-28.9 13.1-40.9 8.6-12.2 20.2-20.9 33.7-25.1l10.3-3.3c5.3-1.7 9-6.6 9.1-12.2l.2-10.8c.2-11.8 5.1-23.6 13.5-32.4 8.3-8.7 18.9-13.4 29.9-13.4 5.6 0 11.1 1.1 16.3 3.2l11.1 4.5c5.7 2.3 12.2.4 15.7-4.7l6.8-9.8C210.4 143.7 248 124 288 124m0-28c-51.2 0-96.3 25.6-123.4 64.7-8.3-3.4-17.4-5.3-26.9-5.3-39.1 0-70.8 34.4-71.4 73.4C26.4 241.5 0 280.5 0 321.5 0 371.7 40.7 416 90.9 416h330.3c50.2 0 90.9-44.3 90.9-94.5 0-44.7-32.3-84.1-74.9-91.7C429 154.6 365.4 96 288 96z'
                fill='currentColor'
              />
            </svg>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-white'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/notes/${note.id}`}
                  className='text-sm hover:font-medium transition-all duration-150'
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus()}
                className='cursor-pointer text-sm hover:font-medium transition-all duration-150'
              >
                {note.status === 'active' ? 'Archive' : 'Restore'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger
                    onClick={(e) => e.stopPropagation()}
                    className='cursor-pointer text-red-600 text-sm hover:font-medium transition-all duration-150'
                  >
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-gray-50 rounded-xl'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your note.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex items-center justify-center space-x-6'>
                      <AlertDialogCancel className='bg-gray-200 hover:opacity-80 duration-150 font-medium rounded-md p-3'>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteNote()}
                        className='bg-black text-white hover:opacity-80 duration-150 font-medium rounded-md p-3'
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <NoteEditorPreview
        content={note.content}
        className='block text-gray-600 overflow-y-auto no-scrollbar my-1 pb-1 text-xs outline-none grow'
      />
      <div className='inline-flex py-1 justify-between'>
        <span className='text-xs text-gray-600 flex items-center justify-start gap-x-1'>
          <FileClock size={14} />
          {formatDistanceToNowStrict(note.lastSaved)}
        </span>
        <LabelInput
          note={note}
          localNotes={localNotes}
          setLocalNotes={setLocalNotes}
          userId={session.data?.user.id}
        />
      </div>
    </div>
  );
}
