'use client'; // Error components must be Client Components

import { Button } from '../../components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex items-center min-h-screen p-4 text-center md:justify-center md:p-6'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
            Oops, something went wrong!
          </h1>
          <p className='mx-auto max-w-[400px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
            The page failed to load.
          </p>
        </div>
        <div>
          <Button onClick={() => reset()}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
