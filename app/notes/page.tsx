import Sidebar from '../components/sidebar';
import Image from 'next/image';

export default function Page() {
  return (
    <main className='flex'>
      <Sidebar />
      <div className='flex items-center justify-center min-h-screen w-full overflow-x-hidden sm:pl-60'>
        <Image
          src={'/notes_app_illustration.png'}
          alt='Mingo icon'
          width={850}
          height={850}
          quality={100}
        />
      </div>
    </main>
  );
}
