import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import Link from 'next/link';
import { nanoid } from 'nanoid';

export default function AddNewNoteButton() {
  const newNoteId = nanoid(7);

  return (
    <AlertDialog>
      <AlertDialogTrigger className='py-2 animate-shimmer hover:shadow-md shadow-gray-100 w-full text-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
        Add new note
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-50 rounded-md'>
        <AlertDialogCancel className='absolute right-0 top-1'>
          <button
            className='bg-gray-100 hover:bg-gray-200 duration-150 shadow-sm py-1 px-2 font-medium rounded-md hover:shadow-md'
            type='button'
            aria-label='close dialog'
          >
            X
          </button>
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle>What type of note do you want?</AlertDialogTitle>
          <AlertDialogDescription>
            Local notes are stored only on your device, while cloud notes are
            stored on a remote server and accessible from any device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex w-full items-center justify-center space-x-6'>
          <AlertDialogAction>
            <Link
              href={`/notes/local/new/${newNoteId}`}
              className='bg-amber-200 hover:bg-amber-300 duration-150 shadow-sm font-medium rounded-md py-1.5 px-3 hover:shadow-md'
            >
              Add Local Note
            </Link>
          </AlertDialogAction>
          <AlertDialogAction>
            <Link
              href={`/notes/cloud/new/${newNoteId}`}
              className='bg-green-200 hover:bg-green-300 duration-150 shadow-sm font-medium rounded-md py-1.5 px-3 hover:shadow-md'
            >
              Add Cloud Note
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
