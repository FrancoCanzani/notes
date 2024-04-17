'use client';

import { Copy, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export function SharePublication({ shareValue }: { shareValue: string }) {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareValue)
      .then(() => toast.success(`Copied ${shareValue}`))
      .catch((err) => toast.error('Failed to copy:', err));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className='hover:opacity-80 rounded-md shadow outline-none px-3 py-2'
        >
          <Share2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md bg-white'>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input id='link' readOnly value={shareValue} />
          </div>
          <Button
            type='submit'
            size='sm'
            className='px-3'
            onClick={copyToClipboard}
          >
            <span className='sr-only'>Copy</span>
            <Copy size={16} className='h-4 w-4 hover:opacity-50' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
