import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { GearIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

export default function UserSettingsModal() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <Dialog>
      <DialogTrigger
        className={
          'px-2 py-1.5 opacity-75 group font-medium rounded-md text-sm flex items-center justify-start gap-x-2 w-full hover:opacity-100'
        }
      >
        <GearIcon />
        Settings
      </DialogTrigger>
      <DialogContent className='bg-gray-50 rounded-md'>
        <h3 className='font-medium'>Settings</h3>
        <hr />
        <div className='text-sm space-y-1'>
          <p className=''>Name: {user?.fullName}</p>
        </div>
        <hr />
        <Button
          variant={'destructive'}
          className='font-medium text-red-700 bg-red-100 hover:bg-red-200 w-fit p-3 rounded-md capitalize text-start flex items-center justify-between'
          onClick={() => signOut({ redirectUrl: '/' })}
        >
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
}
