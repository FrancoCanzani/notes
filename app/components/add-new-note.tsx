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
      <AlertDialogTrigger className='p-3 text-sm flex items-center justify-start gap-x-3 w-full rounded-md hover:bg-amber-200 hover:font-medium bg-amber-100 transition-all duration-150'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1.4em'
          height='1.4em'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='M8 21V7.994h13v8.583L16.577 21zm12-5h-4v4zM5.012 17.806L2.752 5.012l12.794-2.26l.504 2.863H5.618v12.083z'
          />
        </svg>
        New Note
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-50 rounded-xl'>
        <AlertDialogCancel className='absolute right-0 top-1'>
          <button
            className='opacity-90 hover:opacity-100'
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
              className='bg-materialBlue-200 hover:bg-materialBlue-300 font-medium rounded-md px-3 py-3'
            >
              Local
            </Link>
          </AlertDialogAction>
          <AlertDialogAction>
            <Link
              href={`/notes/cloud/new/${newNoteId}`}
              className='bg-amber-200 hover:bg-amber-300 font-medium rounded-md p-3'
            >
              Cloud
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
