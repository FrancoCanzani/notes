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
      <AlertDialogTrigger className='p-4 hover:shadow w-full relative flex items-center justify-center gap-x-4 rounded-xl bg-materialGreen font-medium'>
        <svg
          width='1.2rem'
          height='1.2rem'
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute left-3'
        >
          <path
            d='M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z'
            fill='currentColor'
            fillRule='evenodd'
            clipRule='evenodd'
          ></path>
        </svg>{' '}
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
              className='bg-materialBlue-200 hover:bg-materialBlue-300 font-medium rounded-xl px-4 py-3'
            >
              Local
            </Link>
          </AlertDialogAction>
          <AlertDialogAction>
            <Link
              href={`/notes/cloud/new/${newNoteId}`}
              className='bg-materialBlue-200 hover:bg-materialBlue-300 font-medium rounded-xl px-4 py-3'
            >
              Cloud
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
