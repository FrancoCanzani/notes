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
              className='font-medium bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 inline-flex gap-x-3 items-center justify-center'
            >
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
              Local
            </Link>
          </AlertDialogAction>
          <AlertDialogAction>
            <Link
              href={`/notes/cloud/new/${newNoteId}`}
              className='font-medium rounded-md px-3 py-2 bg-blue-100 hover:bg-blue-200 inline-flex gap-x-3 items-center justify-center'
            >
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
              Cloud
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
