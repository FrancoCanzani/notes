import { FileText } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { saveNote } from '../../lib/actions';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
          router.push(`/notes/${noteId}`);
          setTitle('');
          return 'Note created successfully';
        },
        error: 'Error saving note',
      });
    } else if (!title.trim()) {
      toast.error('Please enter note title');
    }
  }

  return (
    <form
      action={handleSubmit}
      className='flex mb-1 hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer'
    >
      <FileText size={16} />
      <div className='flex items-center justify-center w-max flex-1 gap-x-1'>
        <input
          className='border-none w-full focus-visible:ring-0 focus-visible:ring-offset-0 outline-none bg-transparent'
          placeholder='Note title'
          value={title}
          autoFocus
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type='submit'
          className='rounded-sm px-2 text-xs py-1 bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900'
        >
          Add
        </button>
      </div>
    </form>
  );
}
