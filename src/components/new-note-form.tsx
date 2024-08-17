import { Input } from './ui/input';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { saveNote } from '../lib/actions';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';

export default function NewNoteForm() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const noteId = nanoid(7);
  const router = useRouter();

  async function handleSubmit() {
    if (userId && title.trim()) {
      toast.promise(saveNote(userId, noteId, title, ''), {
        loading: 'Saving note...',
        success: async (data) => {
          await router.push(`/notes/${noteId}`);
          setTitle('');
          return 'Note created successfully';
        },
        error: 'Error saving note',
      });
    } else if (!title.trim()) {
      toast.error('Please enter note title');
    }
  }

  useHotkeys(
    'ctrl+enter, cmd+enter',
    (event) => {
      event.preventDefault();
      handleSubmit();
    },
    { enableOnFormTags: ['INPUT'] }
  );

  return (
    <form
      action={handleSubmit}
      className='w-full p-3 bg-quarter-spanish-white-50 border-dashed border-2 rounded-lg'
    >
      <Input
        className='text-center focus:text-start bg-transparent border-none placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 outline-none font-medium text-sm w-full'
        placeholder='New Note'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
}
