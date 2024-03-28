import Link from 'next/link';
import InstallPWA from './components/install-pwa-button';
import { LoginButton } from './components/log-in';
import { buttonVariants } from './components/ui/button';
import { cn } from './lib/utils';

export default function Component() {
  return (
    <div className='flex flex-col min-h-[100dvh]'>
      <div className='flex flex-col bg-gray-100 items-center justify-center space-y-2 py-10'>
        <InstallPWA className='mb-4' />
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
          QuickNotes
        </h1>
        <p className='max-w-[600px] text-center mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400'>
          {' '}
          Capture your thoughts on the go. The fastest way to jot down ideas,
          make lists, and save inspiration.
        </p>
        <div className='flex items-center justify-center gap-x-12 py-8'>
          <Link
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'border-black hover:opacity-85'
            )}
            href={'/notes'}
          >
            Continue Local
          </Link>

          <LoginButton
            className={
              (buttonVariants({ variant: 'outline' }),
              'bg-black text-white hover:opacity-85')
            }
          />
        </div>
      </div>
      <main>
        <section className='w-full py-12 md:py-24'>
          <div className='grid items-center justify-center gap-4 px-4 text-center md:px-6'>
            <div className='space-y-3'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Features
              </h2>
              <p className='mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                Capture your thoughts quickly with our beautifully designed
                note-taking app.
              </p>
            </div>
            <div className='mx-auto grid max-w-5xl items-start gap-4 sm:grid-cols-2 md:gap-8'>
              <div className='grid gap-1'>
                <h3 className='text-lg font-bold'>Simple Interface</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Intuitive design makes it easy to take notes on the go.
                </p>
              </div>
              <div className='grid gap-1'>
                <h3 className='text-lg font-bold'>Organize Your Notes</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Create notebooks and keep your notes organized.
                </p>
              </div>
              <div className='grid gap-1'>
                <h3 className='text-lg font-bold'>Sync Across Devices</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Access your notes from anywhere, on any device.
                </p>
              </div>
              <div className='grid gap-1'>
                <h3 className='text-lg font-bold'>Local First</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Opt between cloud and local notes for enhanced privacy.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full bg-gray-100 py-12 md:py-24'>
          <div className='grid items-center gap-4 px-4 md:px-6'>
            <div className='space-y-2 text-center'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Contribute to the Project
              </h2>
              <p className='max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400'>
                Help us make QuickNotes even better. Whether it's code
                contributions, bug reports, or feature suggestions, we welcome
                your input.
              </p>
            </div>
            <a
              href='https://github.com/FrancoCanzani/notes'
              target='_blank'
              className={
                'inline-flex bg-black h-10 px-4 py-2 hover:opacity-85 text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-fit m-auto'
              }
            >
              Get Involved
            </a>
          </div>
        </section>
      </main>
      <footer className='flex gap-x-12 py-6 w-full justify-center items-center px-4 md:px-6 border-t'>
        <Link className='text-xs hover:underline underline-offset-4' href='#'>
          Terms of Service
        </Link>
        <Link className='text-xs hover:underline underline-offset-4' href='#'>
          Privacy
        </Link>
      </footer>
    </div>
  );
}
