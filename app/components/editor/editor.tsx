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

export default function Editor({
  noteId,
  cloudNote,
}: {
  noteId: string;
  cloudNote?: Note;
}) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const session = useSession();

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
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
    <div className='max-w-screen-xl flex-grow overflow-clip m-auto sm:pl-60'>
      <div className='flex flex-col min-h-screen pt-6 pb-3 px-3 container'>
        <div className='w-full bg-white rounded-t-md border-b text-gray-600 text-xs overflow-x-clip flex items-center justify-between p-2 gap-x-2'>
          <input
            type='text'
            placeholder='Title'
            onChange={(e) => handleTitleChange(e.target.value)}
            value={title}
            autoFocus
            className='outline-none'
          />
          {cloudNote && (
            <div className='flex items-center justify-end p-1 gap-x-2'>
              <p className='capitalize text-gray-400 hidden md:block'>
                Edited {formatDistanceToNowStrict(cloudNote?.lastSaved)} ago
              </p>
              <EditorOptionsDropdown cloudNote={cloudNote} />
            </div>
          )}
        </div>
        <BubbleMenu editor={editor} />
        <EditorContent
          editor={editor}
          className='flex-grow bg-white rounded-b-md w-full outline-none p-3'
        />
      </div>
    </div>
  );
}
