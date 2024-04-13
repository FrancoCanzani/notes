'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from './components/ui/button';

export default function Page() {
  return (
    <div className='min-h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center space-y-4 bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-neutral-500 py-8'>
        <div>
          <h1 className='text-6xl font-bold text-black'>QuickNotes</h1>
          <h2 className='text-3xl sm:text-4xl font-bold leading-tight mb-4'>
            Get your work and life organized.
          </h2>
        </div>
        <p className='text-balance text-base max-w-2xl sm:text-lg md:text-xl'>
          Capture your thoughts on the go. The fastest way to jot down ideas and
          save inspiration.
        </p>
        <div className='p-6 flex items-center justify-center gap-x-12'>
          <Link
            href={'/notes'}
            className='px-2 py-2.5 rounded-md text-sm bg-gray-200 text-gray-600 font-medium opacity-100 hover:opacity-85'
          >
            Continue Local
          </Link>
          <Link
            href={'/sign-in'}
            className='bg-black px-2 py-2.5 text-sm rounded-md opacity-100 hover:opacity-85 text-white font-medium'
          >
            Sing In
          </Link>
        </div>
      </div>
    </div>
  );
}
