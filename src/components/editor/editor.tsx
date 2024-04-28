'use client';

import { extensions } from '../../lib/extensions';
import { useEffect, useState } from 'react';
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
import { ChevronsLeft } from 'lucide-react';
import { useSidebar } from '../sidebar-provider';
import AiMenu from './ai-menu';
import { defaultEditorProps } from '../../lib/editor-props';

export default function Editor({
  noteId,
  cloudNote,
}: {
  noteId: string;
  cloudNote?: Note;
}) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const session = useSession();
  const { showSidebar, setShowSidebar } = useSidebar();

  const editor = useEditor({
    editorProps: { ...defaultEditorProps },
    extensions,
  });

  useEffect(() => {
    const loadNote = async () => {
      try {
        if (cloudNote) {
          const { title: storedTitle, content } = cloudNote;
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

  editor.on('update', ({ editor }) => {
    debouncedUpdates(editor);
  });

  const handleTitleChange = (input: string) => {
    setTitle(input);
    if (!editor) return;

    // Check if the input is not empty before triggering the debounced update
    if (input.trim().length > 0) {
      debouncedUpdates(editor);
    }
  };

  return (
    <div className='flex-grow overflow-clip m-auto sm:pl-72 md:pl-80'>
      <div className='flex flex-col min-h-screen p-3 container max-w-screen-xl'>
        <div className='bg-white flex-grow rounded-md'>
          <div className='w-full bg-white rounded-t-md border-b text-gray-600 text-xs overflow-x-clip flex items-center justify-between p-2 gap-x-2'>
            <div className='flex items-center justify-start gap-x-2 w-1/2'>
              {setShowSidebar && (
                <button
                  className='rounded-md hover:bg-gray-100 px-1 py-0.5 flex items-center justify-center sm:hidden'
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <ChevronsLeft width={16} />
                </button>
              )}
              <input
                type='text'
                placeholder='Title'
                onChange={(e) => handleTitleChange(e.target.value)}
                value={title}
                autoFocus
                className='outline-none font-medium truncate w-full'
              />
            </div>
            {cloudNote && (
              <div className='flex items-center justify-end w-1/2 p-1 gap-x-2 md:gap-x-3'>
                <AiMenu editor={editor} />
                <p className='text-gray-400 hidden lg:block'>
                  Edited {formatDistanceToNowStrict(cloudNote?.lastSaved)} ago
                </p>
                <EditorOptionsDropdown cloudNote={cloudNote} />
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
