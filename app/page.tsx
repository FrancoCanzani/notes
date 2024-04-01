'use client';

import Link from 'next/link';
import InstallPWA from './components/install-pwa-button';
import { LoginButton } from './components/log-in';
import { buttonVariants } from './components/ui/button';
import { cn } from './lib/utils';
import React from 'react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className='min-h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col items-center justify-center'>
      <header className='fixed top-3'>
        <div className='flex items-center justify-start'>
          <h1 className='text-xl font-bold text-black'>QuickNotes</h1>
          <Image src={'/thunder-icon.png'} alt='Logo' width={30} height={30} />
        </div>
      </header>
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
            className='p-3 rounded-md bg-white font-medium border text-black opacity-100 hover:opacity-85'
          >
            Continue Local
          </Link>
          <LoginButton className='bg-black p-3 rounded-md opacity-100 hover:opacity-85 text-white font-medium' />
        </div>
      </div>
    </div>
  );
}
