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
      <AlertDialogTrigger className='capitalize cursor-pointer duration-150 shadow-sm font-medium rounded-md py-1.5 px-3 hover:shadow-md bg-white w-full text-center opacity-75 hover:opacity-100'>
        Add new note
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-50 rounded-md'>
        <AlertDialogCancel className='absolute right-0.5'>
          <button
            className='bg-gray-100 hover:bg-gray-200 duration-150 shadow-sm py-1 px-2 font-medium rounded-md hover:shadow-md'
            type='button'
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
        <AlertDialogFooter className='flex w-full items-center justify-between'>
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
