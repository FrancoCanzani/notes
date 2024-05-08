import type { Metadata } from 'next';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
export const metadata: Metadata = {
  title: 'Offline',
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
        <div className='flex flex-col items-center space-y-4'>
          <WifiOffIcon className='h-16 w-16 text-gray-500 dark:text-gray-400' />
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
            Oops, you're offline!
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            It looks like you're not connected to the internet. Please check
            your connection and try again.
          </p>
          <Button
            className='px-6 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            variant='outline'
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}

function WifiOffIcon({ className }: { className: string }) {
  return (
    <svg
      className={cn(className)}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 20h.01' />
      <path d='M8.5 16.429a5 5 0 0 1 7 0' />
      <path d='M5 12.859a10 10 0 0 1 5.17-2.69' />
      <path d='M19 12.859a10 10 0 0 0-2.007-1.523' />
      <path d='M2 8.82a15 15 0 0 1 4.177-2.643' />
      <path d='M22 8.82a15 15 0 0 0-11.288-3.764' />
      <path d='m2 2 20 20' />
    </svg>
  );
}
