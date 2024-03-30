import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { GearIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function UserSettingsModal() {
  const session = useSession();

  return (
    <Dialog>
      <DialogTrigger className='font-medium hover:bg-gray-200 p-4 rounded-xl capitalize w-full flex items-center justify-between'>
        User Settings <GearIcon />
      </DialogTrigger>
      <DialogContent className='bg-gray-50 rounded-md'>
        <h3 className='font-medium'>Settings</h3>
        <hr />
        <div className='text-sm space-y-1'>
          <p className=''>Name: {session.data?.user?.name}</p>
          <p className='text-blue-800'>
            <span className='text-black'>Email:</span>{' '}
            {session.data?.user?.email}
          </p>
          <p className=''>
            <span className='text-black'>QuickNotes Id:</span>{' '}
            {session.data?.user?.id}
          </p>
        </div>
        <hr />
        <Button
          variant={'destructive'}
          className='font-medium text-red-700 bg-red-100 hover:bg-red-200 w-fit p-4 rounded-xl capitalize text-start flex items-center justify-between'
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
}
