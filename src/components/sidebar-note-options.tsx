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
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import PublishButton from './buttons/publish-button';
import { NavigatorShareButton } from './buttons/navigator-share-button';
import {
  Trash2,
  FilePenLine,
  Archive,
  ArchiveRestore,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Note } from '../lib/types';
import { deleteCloudNote, updateNoteStatus } from '../lib/actions';
import { useSession } from 'next-auth/react';
import { cn } from '../lib/utils';

export default function SidebarNoteOptions({
  note,
  className,
}: {
  note: Note;
  className?: string;
}) {
  const router = useRouter();
  const session = useSession();

  const handleDeleteNote = async () => {
    if (session.data) {
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
      if (session.data) {
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
    <div className='flex items-center justify-end gap-x-0.5'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className={cn(
              'h-0 w-8 p-0 outline-none hover:bg-gray-100 font-bold rounded-md',
              className
            )}
          >
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='bg-white text-xs'>
          <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full text-xs'>
            <Link
              href={`/notes/${note.id}`}
              className='w-full cursor-pointer flex items-center justify-start gap-x-2'
            >
              <FilePenLine size={13} />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full text-xs'>
            <PublishButton
              cloudNote={note}
              className='flex items-center justify-start gap-x-2'
            />
          </DropdownMenuItem>
          {note.published && (
            <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full text-xs'>
              <NavigatorShareButton
                className='flex items-center justify-start gap-x-2'
                publicationUrl={`notes-franco.vercel.app/notes/published/${note.id}`}
              />
            </DropdownMenuItem>
          )}
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
  );
}