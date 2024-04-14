'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { extensions } from '../lib/extensions';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../lib/actions';
import { Note } from '../lib/types';
import Shortcuts from './shortcuts';
import BubbleMenu from './bubble-menu';
import { get } from 'idb-keyval';
import handleIndexedDBSave from '../lib/helpers/handle-index-db-save';
import AiMenu from './ai-menu';

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
  const pathname = usePathname();
  const noteType = pathname.includes('cloud') ? 'cloud' : 'local';

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
      if (noteType === 'local') {
        const note = await get(noteId);

        if (note) {
          const { title: storedTitle, content } = note;
          setTitle(storedTitle);
          editor?.commands.setContent(JSON.parse(content));
        }
      } else {
        if (cloudNote) {
          const { title: storedTitle, content } = cloudNote;
          setTitle(storedTitle);
          editor?.commands.setContent(JSON.parse(content));
        }
      }
    };

    loadNote();
  }, [noteId, editor]);

  // Debounce the editor updates every second
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    setIsSaved(true);
    const jsonContent = editor.getJSON();
    if (noteType === 'local') {
      await handleIndexedDBSave(noteId, title, JSON.stringify(jsonContent)); // Changed to JSON.stringify(jsonContent)
    } else {
      if (session.data) {
        await saveCloudNote(
          session.data?.user?.id,
          noteId,
          title,
          JSON.stringify(jsonContent)
        );
      }
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
    <div className='flex flex-col space-y-4 min-h-screen py-6 px-3 container'>
      <input
        type='text'
        placeholder='Title'
        onChange={handleTitleChange}
        value={title}
        autoFocus
        className='bg-white rounded-md shadow outline-none px-3 py-2'
      />
      <MenuBar editor={editor} isSaved={isSaved} />
      <AiMenu editor={editor} />
      <BubbleMenu editor={editor} />
      <EditorContent
        editor={editor}
        className='flex-grow bg-white rounded-md w-full shadow outline-none p-3'
      />
      <div className='flex items-center justify-between'>
        <div className='text-xs text-gray-500'>
          {editor.storage.characterCount.characters()} characters /{' '}
          {editor.storage.characterCount.words()} words
        </div>
        <Shortcuts />
      </div>
    </div>
  );
}
