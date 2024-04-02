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
import CommandList from './command-list';
import { get } from 'idb-keyval';
import handleIndexedDBSave from '../lib/helpers/handle-index-db-save';

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
    <div className='space-y-4 py-6 px-3'>
      <input
        type='text'
        placeholder='Title'
        onChange={handleTitleChange}
        value={title}
        autoFocus
        className='relative bg-white rounded-md w-full sm:max-w-screen-2xl shadow outline-none px-3 py-2'
      />
      <MenuBar editor={editor} isSaved={isSaved} />
      <EditorContent
        editor={editor}
        className='relative bg-white min-h-[700px] sm:min-h-[525px] rounded-md w-full sm:max-w-screen-2xl shadow outline-none p-3'
      />
      <div className='flex items-center justify-between'>
        <div className='text-xs text-gray-500'>
          {editor.storage.characterCount.characters()} characters /{' '}
          {editor.storage.characterCount.words()} words
        </div>
        <CommandList />
      </div>
    </div>
  );
}
