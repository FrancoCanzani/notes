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

export default function NoteRow({
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
        'rounded-md p-2 bg-white hover:shadow border transition-all duration-150 truncate flex items-center justify-between'
      )}
    >
      <h3
        className={cn('font-medium truncate text-xs pr-2 w-1/2')}
        title={note.title}
      >
        {note.title}
      </h3>
      <div className='flex items-center justify-end w-1/2 gap-x-2'>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-0 w-8 p-0 outline-none hover:bg-gray-100 font-bold rounded-md'
            >
              <span className='sr-only'>Open menu</span>
              <MoreVertical size={16} />
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
                      This action cannot be undone. This will permanently delete
                      your note.
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
  );
}
