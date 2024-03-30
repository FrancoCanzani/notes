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
            fill-rule='evenodd'
            clip-rule='evenodd'
          ></path>
        </svg>{' '}
        New Note
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-gray-50 rounded-md'>
        <AlertDialogCancel className='absolute right-0 top-1'>
          <button
            className='bg-gray-100 hover:bg-gray-200 duration-150 shadow-sm py-0.5 px-2 font-medium rounded-md hover:shadow-md'
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
              className='bg-black flex items-center justify-center gap-x-2 text-white hover:shadow duration-150 shadow-sm font-medium rounded-md py-1.5 px-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1.5em'
                height='1.5em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M19.8 22.6L17.15 20H6.5q-2.3 0-3.9-1.6T1 14.5q0-1.92 1.19-3.42q1.19-1.51 3.06-1.93q.08-.2.15-.39q.1-.19.15-.41L1.4 4.2l1.4-1.4l18.4 18.4M6.5 18h8.65L7.1 9.95q-.05.28-.07.55q-.03.23-.03.5h-.5q-1.45 0-2.47 1.03Q3 13.05 3 14.5q0 1.45 1.03 2.5q1.02 1 2.47 1m15.1.75l-1.45-1.4q.43-.35.64-.81q.21-.46.21-1.04q0-1.05-.73-1.77q-.72-.73-1.77-.73H17v-2q0-2.07-1.46-3.54Q14.08 6 12 6q-.67 0-1.3.16q-.63.17-1.2.52L8.05 5.23q.88-.6 1.86-.92Q10.9 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1-.37 1.81q-.38.84-1.03 1.44m-6.77-6.72'
                />
              </svg>
              Local
            </Link>
          </AlertDialogAction>
          <AlertDialogAction>
            <Link
              href={`/notes/cloud/new/${newNoteId}`}
              className='bg-black flex items-center justify-center gap-x-2 text-white hover:shadow duration-150 shadow-sm font-medium rounded-md py-1.5 px-3'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1.5em'
                height='1.5em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M4.03 12.03C3.34 12.71 3 13.53 3 14.5s.34 1.79 1.03 2.5c.68.66 1.5 1 2.47 1h6.59c-.05.33-.09.66-.09 1c0 .34.04.67.09 1H6.5c-1.5 0-2.81-.5-3.89-1.57C1.54 17.38 1 16.09 1 14.58c0-1.3.39-2.46 1.17-3.48S4 9.43 5.25 9.15c.42-1.53 1.25-2.77 2.5-3.72S10.42 4 12 4c1.95 0 3.6.68 4.96 2.04C18.32 7.4 19 9.05 19 11c1.15.13 2.1.63 2.86 1.5c.51.57.84 1.21 1 1.92A5.908 5.908 0 0 0 19 13h-2v-2c0-1.38-.5-2.56-1.46-3.54C14.56 6.5 13.38 6 12 6s-2.56.5-3.54 1.46C7.5 8.44 7 9.62 7 11h-.5c-.97 0-1.79.34-2.47 1.03M16 18h2v4h2v-4h2l-3-3z'
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
