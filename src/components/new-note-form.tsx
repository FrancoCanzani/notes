import { Input } from './ui/input';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { saveNote } from '../lib/actions';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewNoteForm({ isNewNote }: { isNewNote: boolean }) {
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
    <AnimatePresence>
      {isNewNote && (
        <motion.form
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.1, ease: 'easeInOut' },
          }}
          action={handleSubmit}
          className='w-full'
        >
          <Input
            className='w-full bg-quarter-spanish-white-50 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none'
            placeholder='Title (Ctrl+Enter to save)'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
