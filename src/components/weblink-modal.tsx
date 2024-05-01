import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { ReactNode, useState } from 'react';
import { saveWeblink } from '../lib/actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WeblinkModal({ children }: { children: ReactNode }) {
  const session = useSession();
  const [url, setUrl] = useState('');
  const router = useRouter();

  async function createWeblink() {
    try {
      const newWebLink = await saveWeblink(session.data?.user.id, url);
      console.log(newWebLink);
      toast.success('Weblink saved successfully!');
      setUrl('');
      router.refresh();
    } catch (error) {
      toast.error('Error saving new weblink.');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white rounded-md'>
        <DialogHeader>
          <DialogTitle>New Weblink</DialogTitle>
          <DialogDescription>
            Add a URL to your personal vault.
          </DialogDescription>
        </DialogHeader>
        <div className='flex py-4'>
          <div className='flex items-center w-full justify-start gap-4'>
            <Label htmlFor='username' className='text-right'>
              URL
            </Label>
            <Input
              id='url'
              name='urlInput'
              placeholder='notes-franco.vercel.app'
              className='w-full'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            onClick={() => createWeblink()}
            className='opacity-65 hover:opacity-100'
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
