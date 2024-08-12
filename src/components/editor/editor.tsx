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
import { formatDistanceToNowStrict } from 'date-fns';
import BubbleMenu from './bubble-menu';
import AiMenu from './ai-menu';
import { defaultEditorProps } from '../../lib/editor-props';
import { useCompletion } from 'ai/react';
import NavDrawer from '../nav-drawer';
import SpeechToText from './speech-recognition';
import MenuBar from './menu-bar';
import isMobile from '../../lib/helpers/is-mobile';
import { useAuth } from '@clerk/nextjs';
import { CircleDashed } from 'lucide-react';

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
  const usesMobile = isMobile();

  const editor = useEditor({
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
            editor?.commands.setContent(JSON.parse(content));
          } else {
            setTitle(`New note - ${noteId}`);
          }
        } catch (error) {
          toast.error('Error loading note.');
        }
      };

      loadNote();
    }
  }, [noteId, editor, note]);

  // Debounce the editor updates every second
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const content = JSON.stringify(editor.getJSON());
    if (userId) {
      await saveNote(userId, noteId, title, content);
    } else {
      await handleIndexedDBSave(noteId, title, content);
    }

    if (notes && !notes.some((note) => note.id === noteId)) {
      window.location.reload;
    }
  }, 1000);

  if (!editor)
    return (
      <div className='grow m-auto min-h-screen container flex items-center justify-center'>
        <CircleDashed className='animate-spin' size={36} />
      </div>
    );

  const handleTitleChange = (input: string) => {
    setTitle(input);
    if (!editor) return;

    // Check if the input is not empty before triggering the debounced update
    if (input.trim().length > 0) {
      debouncedUpdates(editor);
    }
  };

  return (
    <div className='grow overflow-clip m-auto'>
      <div className='flex flex-col min-h-screen container max-w-screen-xl'>
        <div className='bg-white flex-grow rounded-md'>
          <div className='w-full bg-white rounded-t-md text-gray-600 text-xs overflow-x-clip flex items-center justify-between px-3 py-4 gap-x-2'>
            <div className='flex items-center justify-start gap-x-2'>
              <NavDrawer notes={notes} />
            </div>
            <div className='flex items-center justify-end gap-x-2 md:gap-x-3'>
              <SpeechToText editor={editor} />
              <AiMenu editor={editor} />
              {note && (
                <>
                  <p className='text-gray-400 block text-sm'>
                    Edited {formatDistanceToNowStrict(note?.lastSaved)} ago
                  </p>
                  <EditorOptionsDropdown note={note} editor={editor} />
                </>
              )}
            </div>
          </div>
          <div className='grow w-full max-w-screen-lg m-auto px-4 pb-4'>
            <input
              type='text'
              placeholder='Title'
              onChange={(e) => handleTitleChange(e.target.value)}
              value={title}
              autoFocus
              className='font-medium text-xl outline-none pb-4'
            />
            {!usesMobile && <BubbleMenu editor={editor} />}
            <EditorContent
              editor={editor}
              className='grow rounded-b-md w-full max-w-screen-lg m-auto'
            />
          </div>
          {usesMobile && editor.isFocused && (
            <MenuBar editor={editor} className='w-full px-2 py-2' />
          )}
        </div>
      </div>
    </div>
  );
}
