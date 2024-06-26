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
import {
  Trash2,
  FilePenLine,
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  FileClock,
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Button } from './ui/button';
import NoteEditorPreview from './note-editor-preview';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { Note } from '../lib/types';
import { deleteCloudNote, updateNoteStatus } from '../lib/actions';
import { Dispatch, SetStateAction } from 'react';
import { del, set } from 'idb-keyval';
import LabelInput from './label-input';
import { useAuth } from '@clerk/nextjs';

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
  const { userId } = useAuth();

  const handleDeleteNote = async () => {
    if (note.type === 'local') {
      await del(note.id);
      const filtered = localNotes.filter(
        (localNote: Note) => localNote.id !== note.id
      );
      setLocalNotes(filtered);
      toast.success(`Deleted: ${note.title}`);
    } else if (userId) {
      try {
        await deleteCloudNote(userId, note.id);
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
      } else if (userId) {
        newStatus = note.status === 'active' ? 'archived' : 'active';
        await updateNoteStatus(userId, note.id, newStatus);
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
        'border box-border w-full h-64 overflow-y-scroll no-scrollbar inline text-[rgb(132,130,129)] transition-all duration-100 ease-[ease] delay-0 m-0 pt-4 pb-5 px-4 rounded-md border-solid border-[rgb(237,237,237)] hover:[--color-primary:#343433] hover:[--color-text:#343433] hover:[--color-border:#E8E8E8] hover:bg-neutral-50 hover:shadow-[rgba(0,0,0,0.03)_0px_2px_6px]'
      )}
    >
      <div className='flex items-center mb-4 justify-between'>
        <h3
          className={cn('font-medium rounded-t-lg truncate text-sm pr-2')}
          title={note.title}
        >
          {note.title}
        </h3>
        <div className='flex items-center justify-end gap-x-0.5'>
          <span className='text-xs text-gray-600 flex items-center justify-start gap-x-1'>
            <FileClock size={14} />
            {formatDistanceToNowStrict(note.lastSaved)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-0 w-8 p-0 outline-none hover:bg-gray-100 font-bold rounded-md'
              >
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-white text-xs'>
              <DropdownMenuItem
                onClick={() => handleChangeStatus()}
                className='hover:bg-gray-100 rounded-md cursor-pointer w-full text-xs flex items-center justify-start gap-x-2'
              >
                {note.status === 'active' ? (
                  <Archive size={13} />
                ) : (
                  <ArchiveRestore size={13} />
                )}

                {note.status === 'active' ? 'Archive' : 'Restore'}
              </DropdownMenuItem>
              <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full cursor-pointer text-xs'>
                <AlertDialog>
                  <AlertDialogTrigger
                    onClick={(e) => e.stopPropagation()}
                    className='cursor-pointer text-red-600 flex items-center justify-start gap-x-2'
                  >
                    <Trash2 size={13} />
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-gray-50 rounded-md'>
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
    </div>
  );
}
