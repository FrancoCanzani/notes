'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { extensions } from '../../lib/extensions';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../../lib/actions';
import { Note } from '../../lib/types';
import Shortcuts from './shortcuts';
import handleIndexedDBSave from '../../lib/helpers/handle-index-db-save.';
import { get, del } from 'idb-keyval';
import PublishButton from '../buttons/publish-button';
import { SharePublication } from './share-publication';
import BubbleMenu from './bubble-menu';
import { toast } from 'sonner';

export default function Editor({
  noteId,
  cloudNote,
}: {
  noteId: string;
  cloudNote?: Note;
}) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const [isSaved, setIsSaved] = useState(false);
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
        }
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
              title,
              content
            );
            if (syncedCloudNote) {
              await del(noteId);
            } else {
              throw new Error('Failed to sync note to the cloud.');
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
    setIsSaved(true);
    const jsonContent = editor.getJSON();
    if (session && session.data) {
      await saveCloudNote(
        session.data?.user?.id,
        noteId,
        title,
        JSON.stringify(jsonContent)
      );
    } else {
      await handleIndexedDBSave(noteId, title, JSON.stringify(jsonContent));
    }
  }, 1000);

  if (!editor) return null;

  editor.on('update', ({ editor }) => {
    debouncedUpdates(editor);
    setIsSaved(false);
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!editor) return;
    debouncedUpdates(editor);
  };

  return (
    <div className='max-w-screen-xl flex-grow overflow-clip m-auto sm:pl-60'>
      <div className='flex flex-col min-h-screen pt-6 pb-3 px-3 container'>
        <div className='w-full overflow-x-clip flex items-center justify-center gap-x-2'>
          <input
            type='text'
            placeholder='Enter a Title'
            onChange={handleTitleChange}
            value={title}
            autoFocus
            className='bg-gray-50 w-full rounded-sm outline-none px-3 py-2'
          />
          <PublishButton cloudNote={cloudNote} />
          {cloudNote?.published && (
            <SharePublication
              shareValue={`notes-franco.vercel.app/notes/published/${cloudNote.id}`}
            />
          )}
        </div>
        <MenuBar editor={editor} isSaved={isSaved} />
        <BubbleMenu editor={editor} />
        <EditorContent
          editor={editor}
          className='flex-grow bg-white rounded-sm w-full outline-none p-3'
        />
        <div className='flex items-center justify-between pt-4'>
          <div className='text-xs text-gray-500'>
            {editor.storage.characterCount.characters()} characters /{' '}
            {editor.storage.characterCount.words()} words
          </div>
          <Shortcuts />
        </div>
      </div>
    </div>
  );
}
