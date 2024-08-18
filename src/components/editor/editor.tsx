'use client';

import { extensions } from '../../lib/extensions';
import { useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { saveNote } from '../../lib/actions';
import { Note } from '../../lib/types';
import handleIndexedDBSave from '../../lib/helpers/handle-index-db-save.';
import { toast } from 'sonner';
import { EditorContent, useEditor } from '@tiptap/react';
import EditorOptionsDropdown from './editor-options-dropdown';
import { formatRelative } from 'date-fns';
import { defaultEditorProps } from '../../lib/editor-props';
import { useCompletion } from 'ai/react';
import NavDrawer from '../nav-drawer';
import { useAuth } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import BubbleMenuTest from './bubble-menu-test';
import AiSidebar from '../ai-sidebar';

export default function Editor({
  noteId,
  note,
  notes,
}: {
  noteId: string;
  note?: Note;
  notes?: Note[];
}) {
  const [title, setTitle] = useState('');
  const { userId } = useAuth();

  const editor = useEditor({
    parseOptions: {
      preserveWhitespace: true,
    },
    editorProps: { ...defaultEditorProps },
    extensions,
  });

  const { completion, isLoading } = useCompletion({
    id: 'editor',
    api: '/api/ai',
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error('Failed to execute action');
    },
  });

  const prev = useRef('');

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  editor &&
    editor.on('update', ({ editor }) => {
      debouncedUpdates(editor);
    });

  useEffect(() => {
    if (noteId) {
      const loadNote = async () => {
        try {
          if (note) {
            const { title: storedTitle, content } = note;
            setTitle(storedTitle);
            if (content) {
              editor?.commands.setContent(JSON.parse(content));
            } else {
              editor?.commands.setContent('');
            }
          } else {
            setTitle(`New note - ${noteId}`);
            editor?.commands.setContent('');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          toast.error('Error loading note.');
        }
      };

      loadNote();
    }
  }, [noteId, editor, note]);

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const content = editor.getJSON();
    if (userId) {
      await saveNote(userId, noteId, title, JSON.stringify(content));
    } else {
      await handleIndexedDBSave(noteId, title, JSON.stringify(content));
    }

    if (notes && !notes.some((note) => note.id === noteId)) {
      window.location.reload();
    }
  }, 1000);

  if (!editor)
    return (
      <div className='grow m-auto bg-quarter-spanish-white-50 min-h-screen container flex items-center justify-center'>
        <Loader className='animate-spin text-gray-400' size={26} />
      </div>
    );

  const handleTitleChange = (input: string) => {
    setTitle(input);
    if (!editor) return;

    if (input.trim().length > 0) {
      debouncedUpdates(editor);
    }
  };

  return (
    <main className='flex h-screen'>
      <div className='flex-grow overflow-auto thin-scrollbar bg-quarter-spanish-white-50'>
        <div className='flex flex-col container'>
          <div className=''>
            <div className='w-full text-gray-600 text-xs overflow-x-clip flex items-center justify-between px-3 py-4 gap-x-2'>
              <div className='flex  max-w-[50%] items-center justify-start gap-x-2'>
                <NavDrawer notes={notes} />
                <input
                  type='text'
                  placeholder='Title'
                  onChange={(e) => handleTitleChange(e.target.value)}
                  value={title}
                  autoFocus
                  className='font-medium text-xl bg-quarter-spanish-white-50 outline-none'
                />
              </div>
              <div className='flex items-center justify-end gap-x-2 md:gap-x-3'>
                {note && (
                  <>
                    <span className='text-gray-400 capitalize block text-sm'>
                      {formatRelative(new Date(note?.lastSaved), new Date())}
                    </span>
                    <EditorOptionsDropdown note={note} editor={editor} />
                  </>
                )}
              </div>
            </div>
            <div className='w-full m-auto px-4 pb-4'>
              <BubbleMenuTest editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
      <AiSidebar editor={editor} />
    </main>
  );
}
