import { useState } from 'react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { saveNote } from '../../lib/actions';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@radix-ui/react-icons';

export default function NewNoteDialog() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const noteId = nanoid(7);

    if (userId && title.trim()) {
      toast.promise(saveNote(userId, noteId, title, ''), {
        loading: 'Saving note...',
        success: async (data) => {
          router.push(`/notes/${noteId}`);
          setTitle('');
          setIsOpen(false);
          return 'Note created successfully';
        },
        error: 'Error saving note',
      });
    } else if (!title.trim()) {
      toast.error('Please enter note title');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='w-full bg-bermuda-gray-50 hover:bg-bermuda-gray-100'
          variant={'outline'}
        >
          <PlusIcon className='mr-2 h-4 w-4' /> ADD NOTE
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-bermuda-gray-50'>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Note title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full rounded-sm'
          />
          <Button
            type='submit'
            variant={'outline'}
            className='w-full bg-bermuda-gray-100 hover:bg-bermuda-gray-200'
          >
            Create Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
