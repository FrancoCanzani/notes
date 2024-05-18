'use client';

import Link from 'next/link';
import { Separator } from '../components/ui/separator';

export default function Page() {
  return (
    <div className='min-h-screen bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 w-full bg-stone-100 relative flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center py-8'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-bold mb-2 text-black'>
            QuickNotes
          </h1>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4'>
            Get your work and life organized.
          </h2>
        </div>
        <p className='text-balance text-sm max-w-3xl sm:text-lg md:text-xl'>
          Introducing The Ultimate Note-Taking App with AI Integration, Slash
          Commands, Markdown Support and Calendar.
        </p>
        <div className='p-6 flex items-center justify-center gap-x-9'>
          <Link href={'/sign-up'} className='text-orange-500 hover:underline'>
            Sign Up
          </Link>
          - or -
          <Link href={'/sign-up'} className='text-orange-500 hover:underline'>
            Sign In
          </Link>
        </div>
      </div>
      <Separator className='bg-gray-200 max-w-3xl px-6' />
      <div className='flex flex-col items-start justify-center space-y-4 py-8 px-10 lg:px-0'>
        <a
          href='https://github.com/FrancoCanzani/notes'
          target='_blank'
          className='text-lg sm:text-xl font-bold leading-tight hover:underline'
        >
          Open Source
        </a>
        <p className='text-balance text-base max-w-3xl sm:text-sm md:text-base'>
          QuickNotes is fully open-source, ensuring complete transparency and
          trust. You can review, contribute to, and customize the code to fit
          your needs. Your feedback and contributions help shape the future of
          the app.
        </p>
        <Separator className='bg-gray-200 max-w-3xl px-6' />
        <h3 className='text-lg sm:text-xl font-bold leading-tight hover:underline'>
          Features
        </h3>
        <ul className=' sm:text-sm md:text-base'>
          <li>
            QuickNotes is fully open-source, ensuring complete transparency and
            trust.
          </li>
          <li>AI-powered suggestions for smarter note-taking.</li>
          <li>Speech recognition for hands-free note-taking.</li>
          <li>Seamless cloud synchronization across all your devices.</li>
          <li>
            Intuitive and user-friendly interface for efficient note-taking.
          </li>
          <li>Supports multimedia notes, including images.</li>
        </ul>
      </div>
    </div>
  );
}
