import Link from 'next/link';
import { nanoid } from 'nanoid';

export default function AddNewNoteButton() {
  const newNoteId = nanoid(7);

  return (
    <Link
      href={`dashboard/notes/new/${newNoteId}`}
      className='p-3 text-sm flex items-center justify-start gap-x-3 w-full rounded-md hover:bg-amber-200 hover:font-medium bg-amber-100 transition-all duration-150'
    >
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
    </Link>
  );
}
