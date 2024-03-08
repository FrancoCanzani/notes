import Image from 'next/image';

export default function Header() {
  return (
    <header className='flex items-center justify-between'>
      <div className='flex items-center justify-start space-x-2'>
        <Image
          src={'/flamingo-icon.webp'}
          alt='Mingo icon'
          width={30}
          height={30}
        />
        <h1 className='font-bold text-xl antialiased'>
          <span className='text-pink-500'>Mingo</span>Notes
        </h1>
      </div>
      <p className='font-bold'>User</p>
    </header>
  );
}
