import Image from 'next/image';
import { SignInButton } from '../components/buttons/sign-in';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className='container w-full h-screen m-auto flex flex-col items-center justify-center'>
      <div className='flex flex-col items-start justify-between rounded-sm bg-white px-8 py-12 shadow w-3/4 lg:max-w-md'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-start'>
            <h1 className='text-3xl font-bold text-black'>QuickNotes</h1>
            <Image
              src={'/thunder-icon.png'}
              alt='Logo'
              width={30}
              height={30}
            />
          </div>
          <h1 className='mt-6 text-xl font-extrabold'>Sign in</h1>
          <p className='text-gray-700'>
            to continue to <span className='font-bold'>QuickNotes</span>
          </p>
        </div>
        <SignInButton
          provider='github'
          className='mt-6 flex w-full justify-center gap-4 rounded border border-gray-200 bg-white px-3 py-2 hover:bg-gray-300/50 disabled:opacity-60'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
          >
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'></path>
          </svg>
          Sign In with GitHub
        </SignInButton>
        <SignInButton
          provider='google'
          className='mt-6 flex w-full justify-center gap-4 rounded border border-gray-200 bg-white px-3 py-2 hover:bg-gray-300/50 disabled:opacity-60'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.4em'
            height='1.4em'
            viewBox='0 0 256 256'
          >
            <path
              fill='#4285F4'
              d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
            />
            <path
              fill='#34A853'
              d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
            />
            <path
              fill='#FBBC05'
              d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z'
            />
            <path
              fill='#EB4335'
              d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
            />
          </svg>
          Sign In with Google
        </SignInButton>
      </div>
      <div className='flex pt-4'>
        <span>
          By signing in, you agree to our{' '}
          <Link
            className='text-blue-500 underline'
            href='/info/terms-of-service'
          >
            Terms of Service
          </Link>
        </span>
      </div>
    </div>
  );
}
