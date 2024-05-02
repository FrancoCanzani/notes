'use client';

import Link from 'next/link';
import React from 'react';

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
        <div className='p-6 flex items-center justify-center gap-x-9'>
          <Link
            href={'/dashboard/notes'}
            className='inline-flex h-10 text-sm hover:animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
          >
            <div className='relative flex space-x-2 items-center py-0.5 px-4'>
              Continue
            </div>{' '}
          </Link>
          - or -
          <Link
            href={'/sign-in'}
            className='inline-flex h-10 text-sm hover:animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
          >
            <div className='relative flex space-x-2 items-center py-0.5 px-4'>
              Sign In
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
