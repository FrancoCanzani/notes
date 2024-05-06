'use client';

import { extensions } from '../../lib/extensions';
import { useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../../lib/actions';
import { Note } from '../../lib/types';
import handleIndexedDBSave from '../../lib/helpers/handle-index-db-save.';
import { get, del } from 'idb-keyval';
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

export default function Editor({
  noteId,
  note,
  notes,
}: {
  noteId: string;
  note?: Note;
  notes?: Note[];
}) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const session = useSession();

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
      toast.error('Failed to execute command');
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
    const loadNote = async () => {
      try {
        if (note) {
          const { title: storedTitle, content } = note;
          setTitle(storedTitle);
          editor?.commands.setContent(JSON.parse(content));
        } else {
          const note = await get(noteId);
          if (note) {
            const { title: storedTitle, content } = note;
            setTitle(storedTitle);
            editor?.commands.setContent(JSON.parse(content));
            if (session && session.data) {
              // Convert the local note to cloud when there's a user
              const syncedCloudNote = await saveCloudNote(
                session.data.user.id,
                noteId,
                storedTitle,
                content
              );
              if (syncedCloudNote) {
                await del(noteId);
              }
            }
          }
        }
      } catch (error) {
        toast.error('Error loading and syncing note.');
      }
    };

    loadNote();
  }, [noteId, editor]);

  // Debounce the editor updates every second
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const content = JSON.stringify(editor.getJSON());
    if (session && session.data) {
      await saveCloudNote(session.data?.user?.id, noteId, title, content);
    } else {
      await handleIndexedDBSave(noteId, title, content);
    }
  }, 1000);

  if (!editor) return null;

  const handleTitleChange = (input: string) => {
    setTitle(input);
    if (!editor) return;

    // Check if the input is not empty before triggering the debounced update
    if (input.trim().length > 0) {
      debouncedUpdates(editor);
    }
  };

  return (
    <div className='flex-grow overflow-clip m-auto'>
      <div className='flex flex-col min-h-screen container max-w-screen-xl'>
        <div className='bg-white flex-grow rounded-md'>
          <div className='w-full bg-white rounded-t-md border-b text-gray-600 text-xs overflow-x-clip flex items-center justify-between p-2 gap-x-2'>
            <div className='flex items-center justify-start gap-x-2 w-1/2'>
              <NavDrawer notes={notes} />
              <input
                type='text'
                placeholder='Title'
                onChange={(e) => handleTitleChange(e.target.value)}
                value={title}
                autoFocus
                className='outline-none font-medium truncate w-full'
              />
            </div>
            {note && (
              <div className='flex items-center justify-end w-1/2 p-1 gap-x-2 md:gap-x-3'>
                <SpeechToText editor={editor} />
                <AiMenu editor={editor} />
                <p className='text-gray-400 hidden lg:block'>
                  Edited {formatDistanceToNowStrict(note?.lastSaved)} ago
                </p>
                <EditorOptionsDropdown cloudNote={note} />
              </div>
            )}
          </div>
          <BubbleMenu editor={editor} />
          <EditorContent
            editor={editor}
            className='flex-grow bg-white rounded-b-md w-full max-w-screen-lg m-auto outline-none p-4'
          />
        </div>
      </div>
    </div>
  );
}
