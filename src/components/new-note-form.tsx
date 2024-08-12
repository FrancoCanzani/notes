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
          toast.success(`Note has been saved`);
          await router.push(`/notes/${noteId}`);
          setTitle('');
          return 'Note saved successfully';
        },
        error: 'Error saving note',
      });
    } else if (!title.trim()) {
      toast.error('Please enter a title for the note');
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
    <form action={handleSubmit} className='w-full'>
      <Input
        className='w-full'
        placeholder='Title (Ctrl+Enter to save)'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
}
