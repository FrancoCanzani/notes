'use client';

import { LoginButton } from './components/log-in';
import Image from 'next/image';
import Link from 'next/link';
import InstallPWA from './components/install-pwa-button';

export default function Page() {
  return (
    <main className={`max-w-4xl m-auto`}>
      <div className='flex flex-col h-[calc(100vh-theme(spacing.16))] items-center justify-center space-y-10 py-10'>
        <Image
          src={'/flamingo-icon.webp'}
          alt='Mingo icon'
          width={65}
          height={65}
        />
        <h2 className='text-center text-pretty'>
          Welcome to <strong>Flamingo</strong>, the simple note taking app
        </h2>
        <InstallPWA />
        <div className='flex items-center justify-center space-x-3'>
          <Link
            href={'/notes'}
            className='p-2 border-2 font-medium hover:bg-amber-300 text-sm border-amber-200 bg-amber-200 rounded-md shadow shadow-amber-100'
          >
            Continue Local
          </Link>
          <LoginButton
            callbackUrl='/editor'
            className='p-2 border-2 hover:bg-amber-300 text-sm border-amber-200 bg-amber-200 rounded-md shadow shadow-amber-100'
          />
        </div>
      </div>
    </main>
  );
}
