import { LoginButton } from './components/log-in';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className='flex flex-col sm:flex-row items-center justify-center space-x-3 space-y-5 sm:space-y-0'>
          <Link
            href={'/notes'}
            className='p-4 border-2 border-pink-400 rounded-md shadow shadow-pink-300 max-w-sm mx-auto space-y-2'
          >
            <h2 className='flex items-center justify-center text-sm font-medium'>
              Continue Anonymously
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 20 20'
                className='ml-1'
              >
                <path
                  fill='currentColor'
                  d='M15 2H5L4 8h12zM0 10s2 1 10 1s10-1 10-1l-4-2H4zm8 4h4v1H8z'
                />
                <circle cx='6' cy='15' r='3' fill='currentColor' />
                <circle cx='14' cy='15' r='3' fill='currentColor' />
              </svg>
            </h2>
            <ul className='text-sm'>
              <li>✓ Quick access</li>
              <li>✓ Preserves user privacy</li>
              <li>✕ Risk of data loss</li>
              <li>✕ No syncing across devices</li>
            </ul>
          </Link>
          <div className='p-4 border-2 border-pink-400 rounded-md shadow shadow-pink-300 max-w-sm mx-auto space-y-2'>
            <LoginButton callbackUrl='/editor' />
            <ul className='text-sm'>
              <li>✓ Ability to save data </li>
              <li>✓ Syncing across devices</li>
              <li>✓ Enhanced security</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
