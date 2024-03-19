'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import handleLocalStorageSave from '../lib/helpers/handle-local-storage-save';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../lib/actions';
import { Note } from '../lib/types';

const extensions = [
  Color,
  TextStyle,
  ListItem,
  Underline,
  Highlight,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

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
  const userId = session.data?.user?.id;
  const pathname = usePathname();
  const noteType = pathname.includes('cloud') ? 'cloud' : 'local';

  console.log(cloudNote);

  const editor = useEditor({
    autofocus: true,
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
        const note = window.localStorage.getItem(`note_${noteId}`);
        console.log(note);

        if (note) {
          const { title: storedTitle, content } = JSON.parse(note);
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
  }, [editor, noteId, noteType, userId]);

  // Debounce the editor updates
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    setIsSaved(true);
    const json = editor.getJSON();
    if (noteType === 'local') {
      handleLocalStorageSave(noteId, title, JSON.stringify(json));
    } else {
      await saveCloudNote(userId, noteId, title, JSON.stringify(json));
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
        className='relative bg-gray-50 rounded-sm w-full sm:max-w-screen-2xl shadow outline-none px-3 py-2'
      />
      <MenuBar editor={editor} isSaved={isSaved} />
      <EditorContent
        editor={editor}
        className='relative min-h-[550px] rounded-sm w-full sm:max-w-screen-2xl shadow outline-none p-3'
      />
    </div>
  );
}
