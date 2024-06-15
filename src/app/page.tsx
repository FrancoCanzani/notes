import Link from 'next/link';
import { FlipWords } from '../components/ui/flip-words';
import Feature from '../components/feature';
import { CrumpledPaperIcon } from '@radix-ui/react-icons';

export default function Page() {
  const words = ['Efficient', 'Fast', 'Intuitive', 'Powerful'];
  const features = [
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 32 32'
        >
          <path
            fill='currentColor'
            d='M27.87 4.423c.131.284.352.508.644.635l1.215.527a.453.453 0 0 1 0 .83l-1.205.527a1.22 1.22 0 0 0-.643.635l-.954 2.167c-.17.341-.683.341-.854 0l-.954-2.167a1.256 1.256 0 0 0-.643-.635l-1.205-.527a.453.453 0 0 1 0-.83l1.205-.527a1.22 1.22 0 0 0 .643-.635l.954-2.167c.17-.341.683-.341.854 0zm-11.887.742a.89.89 0 0 0 .458.438l.864.36c.26.117.26.457 0 .574l-.864.36a.848.848 0 0 0-.458.438l-.676 1.49c-.125.233-.49.233-.614 0l-.676-1.49a.885.885 0 0 0-.458-.438l-.864-.36a.309.309 0 0 1 0-.574l.864-.36a.848.848 0 0 0 .458-.438l.676-1.49c.125-.233.49-.233.614 0zM4 26l-1.662 1.627a1.146 1.146 0 0 0 0 1.625l.41.41c.44.452 1.17.452 1.61-.01L6 28.007l-.003-.003L20 14l1.674-1.667c.435-.445.435-1.24 0-1.675l-.33-.331C20.9 9.89 20 10 19.5 10.5zm21.95-9.702a.948.948 0 0 1-.46-.48l-.685-1.622c-.128-.261-.492-.261-.61 0l-.685 1.623a.947.947 0 0 1-.46.479l-.857.392c-.257.13-.257.5 0 .62l.856.392a.948.948 0 0 1 .46.48l.686 1.622c.128.261.492.261.61 0l.685-1.622a.947.947 0 0 1 .46-.48l.857-.392c.257-.13.257-.5 0-.62zM12 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2m18-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0M19 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0'
          />
        </svg>
      ),
      title: 'Ai Actions',
      description:
        'Seamlessly integrate the power of Chat GPT into your note-taking experience.',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='M9 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.5-2.56 6.43-6 6.93V21H8v-3.07c-3.44-.5-6-3.43-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5zm-1-6h3V2h2v3h3v2h-3v3h-2V7h-3z'
          />
        </svg>
      ),
      title: 'Speech Recognition',
      description:
        'Transform the way you interact with your notes through speech recognition technology.',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 24 24'
        >
          <path
            fill='none'
            stroke='currentColor'
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='1.5'
            d='M21 3.6v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6M10 16l4-8'
          />
        </svg>
      ),
      title: 'Notion-like Slash Command',
      description:
        'Quickly access commands and features with our Notion-like Slash Command.',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 256 256'
        >
          <path
            fill='currentColor'
            d='M216 40H72a16 16 0 0 0-16 16v16H40a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m-44 32a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 128H40V88h16v80a16 16 0 0 0 16 16h112Zm32-32H72v-47.31l30.34-30.35a8 8 0 0 1 11.32 0L163.31 140L189 114.34a8 8 0 0 1 11.31 0L216 130.07z'
          />
        </svg>
      ),
      title: 'Image Support',
      description: 'Easily upload, manage, and embed images within your notes.',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 26 26'
        >
          <path
            fill='currentColor'
            d='M7.875 0a1 1 0 0 0-.656.375L3.812 4.656l-2.25-1.5A1.014 1.014 0 1 0 .438 4.844l3 2a1 1 0 0 0 1.344-.219l4-5A1 1 0 0 0 7.875 0M12 3v2h14V3zM7.875 9a1 1 0 0 0-.656.375l-3.407 4.281l-2.25-1.5a1.014 1.014 0 1 0-1.125 1.688l3 2a1 1 0 0 0 1.344-.219l4-5A1 1 0 0 0 7.875 9M12 12v2h14v-2zm-4.125 6a1 1 0 0 0-.656.375l-3.407 4.281l-2.25-1.5a1.014 1.014 0 1 0-1.125 1.688l3 2a1 1 0 0 0 1.344-.219l4-5A1 1 0 0 0 7.875 18M12 21v2h14v-2z'
          />
        </svg>
      ),
      title: "Todo's Section",
      description:
        "Keep track of your tasks effortlessly with our integrated Todo's Section.",
    },

    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 48 48'
        >
          <g fill='currentColor' fill-rule='evenodd' clip-rule='evenodd'>
            <path d='M39 8H9a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1M9 6a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3z' />
            <path d='M11.434 10q-.392 0-.776.032a.713.713 0 0 0-.658.708v27.55c0 .392.32.71.717.71h2.15a.714.714 0 0 0 .717-.71v-5.186l2.937 1.247c.375.16.832.328 1.309.39c.485.063 1.036.022 1.548-.288a2.84 2.84 0 0 0 1.375-2.427v-2.131a.714.714 0 0 0-.717-.71l-2.206-.711c0-.785.697-.71 1.49-.71h.716a.714.714 0 0 0 .717-.711v-1.421h.81c1.146 0 1.829-1.265 1.194-2.21l-2.004-2.98v-1.205c0-5.101-4.172-9.237-9.32-9.237m7.168 11.013a1.07 1.07 0 0 1-1.075 1.066a1.07 1.07 0 0 1-1.075-1.066a1.07 1.07 0 0 1 1.075-1.066a1.07 1.07 0 0 1 1.075 1.066m6.895 9.071A2.41 2.41 0 0 0 26.684 28c0-.893-.479-1.67-1.189-2.084l1.01-1.727A4.41 4.41 0 0 1 28.685 28a4.41 4.41 0 0 1-2.18 3.81zM30.895 28c0-2.067-.9-3.786-2.113-4.663l1.173-1.62c1.807 1.307 2.94 3.672 2.94 6.283c0 2.61-1.133 4.976-2.94 6.284l-1.173-1.62c1.213-.878 2.113-2.597 2.113-4.664' />
            <path d='M32.115 35.217c1.726-1.369 2.99-4.036 2.99-7.217s-1.264-5.848-2.99-7.216l1.243-1.567c2.302 1.825 3.747 5.128 3.747 8.783c0 3.656-1.445 6.958-3.747 8.783z' />
          </g>
        </svg>
      ),
      title: 'NLP Scheduling',
      description:
        'chedule your tasks using natural language processing (NLP) capabilities."',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 256 158'
        >
          <path d='M238.371 157.892H18.395C8.431 157.892 0 149.462 0 139.497V18.395C0 8.431 8.431 0 18.395 0h219.21C247.569 0 256 8.431 256 18.395v121.102c0 9.964-7.665 18.395-17.629 18.395M18.395 12.263c-3.066 0-6.132 3.066-6.132 6.132v121.102c0 3.832 3.066 6.132 6.132 6.132h219.21c3.832 0 6.132-3.066 6.132-6.132V18.395c0-3.832-3.066-6.132-6.132-6.132zM36.79 121.102V36.79h24.527l24.527 30.66l24.527-30.66h24.527v84.312h-24.527V72.814l-24.527 30.66l-24.527-30.66v48.288zm154.06 0l-36.79-40.623h24.527V36.79h24.527v42.923h24.527z' />
        </svg>
      ),
      title: 'Markdown Support',
      description: 'Use Markdown to format your notes with ease.',
    },
    {
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='2.5rem'
          height='2.5rem'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6z'
          />
        </svg>
      ),
      title: 'Open Source',
      description:
        'QuickNotes is open source, giving you the freedom to adapt and build on top.',
    },
  ];

  return (
    <main className='flex-1 bg-gradient-to-b from-neutral-100 to-neutral-50 h-full'>
      <header className='supports-backdrop-blur:bg-background/90 px-4 py-1.5 sticky top-0 z-40 w-full bg-background/40 backdrop-blur-lg'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <CrumpledPaperIcon className='h-6 w-6 text-neutral-600' />
            <h1 className='text-lg font-bold'>QuickNotes</h1>
          </div>
          <Link className='font-semibold' href={'/sign-in'}>
            Sign In
          </Link>
        </div>
      </header>
      <div className='flex flex-col pt-10 items-center gap-6 pb-8 text-center'>
        <div>
          <Link href='/todos'>
            <div className='group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40'>
              <div className='absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'></div>
              <div className='absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] p-[1px] ![mask-composite:subtract]'></div>
              🎉
              <div
                data-orientation='vertical'
                role='none'
                className='shrink-0 bg-border w-[1px] mx-2 h-4'
              ></div>{' '}
              <span className='animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent inline'>
                Now Introducing Todo's
              </span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='ml-1 h-4 w-4 text-gray-500'
              >
                <path d='m9 18 6-6-6-6'></path>
              </svg>
            </div>
          </Link>
        </div>
        <div className='flex justify-center items-center px-4'>
          <div className='text-balance bg-gradient-to-br from-black from-30% to-black/60 space-y-3 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-7xl'>
            <div className='relative h-20'>
              <FlipWords words={words} /> <br />
            </div>
            Note-taking made simple
          </div>
        </div>
        <p className='max-w-[64rem] text-balance text-lg tracking-tight text-gray-500 md:text-xl'>
          Experience a clutter-free, intuitive, and powerful note-taking app.
          Save time and stay organized with QuickNotes, your ultimate tool for
          efficient note-taking.
        </p>
      </div>
      <section className='flex justify-center items-center min-h-screen'>
        <div className='grid grid-cols-1 max-w-4xl align-top justify-items-center w-full p-4 sm:grid-cols-2 gap-4'>
          {features.map((feature) => (
            <Feature
              key={feature.title}
              svg={feature.svg}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
      <footer className='bg-neutral-100 py-6'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <CrumpledPaperIcon className='h-6 w-6' />
              <h1 className='text-lg font-bold'>QuickNotes</h1>
            </div>
            <nav className='space-x-4 mt-4 sm:mt-0'>
              <Link href='/about'>About</Link>
              <Link href='/contact'>Contact</Link>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </nav>
          </div>
          <div className='mt-4 text-center text-sm m-auto w-full text-neutral-700'>
            <p>&copy; 2024 QuickNotes. All rights reserved.</p>
            <p>Designed and developed by You.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
