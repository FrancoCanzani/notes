'use client';

import Image from 'next/image';
import UserDropdown from './user-dropdown';

export default function Header() {
  return (
    <header className='flex items-center justify-between w-full'>
      <Image
        src={'/flamingo-icon.webp'}
        alt='Mingo icon'
        width={30}
        height={30}
      />
      <UserDropdown />
    </header>
  );
}
