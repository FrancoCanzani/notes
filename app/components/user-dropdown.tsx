'use client';

import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { LoginButton } from './log-in';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function UserDropdown() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      {user ? (
        <div className='flex items-center justify-start space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src={
                  session.data?.user?.image ?? '/profile-photo-placeholder.webb'
                }
                alt='user pic'
                width={30}
                height={30}
                className='rounded-full shadow border'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white text-start'>
              <DropdownMenuLabel>User settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='hover:bg-gray-50'>
                <Button
                  variant={'destructive'}
                  className='text-start text-red-600'
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <p className='text-xs font-medium'>{session.data?.user?.name}</p>
            <p className='text-xs text-blue-800'>{session.data?.user?.email}</p>
          </div>
        </div>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
