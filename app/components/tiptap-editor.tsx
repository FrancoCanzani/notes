'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { Color } from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import handleLocalStorageSave from '../lib/helpers/handle-local-storage-save';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../lib/actions';
import { Note } from '../lib/types';
import CommandList from './command-list';

const extensions = [
  Color,
  TextStyle,
  Link,
  BulletList,
  ListItem,
  TaskList,
  TaskItem,
  Underline,
  Highlight,
  CharacterCount,
  TaskList,
  Heading.configure({
    levels: [1],
  }),
  StarterKit,
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
  const pathname = usePathname();
  const noteType = pathname.includes('cloud') ? 'cloud' : 'local';

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
  }, [editor, noteId, noteType]);

  // Debounce the editor updates
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    setIsSaved(true);
    const json = editor.getJSON();
    if (noteType === 'local') {
      handleLocalStorageSave(noteId, title, JSON.stringify(json));
    } else {
      if (session.data) {
        await saveCloudNote(
          session.data?.user?.id,
          noteId,
          title,
          JSON.stringify(json)
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
        className='relative bg-gray-50 rounded-md w-full sm:max-w-screen-2xl shadow outline-none px-3 py-2'
      />
      <MenuBar editor={editor} isSaved={isSaved} />
      <EditorContent
        editor={editor}
        className='relative bg-gray-50 min-h-[700px] sm:min-h-[525px] rounded-md w-full sm:max-w-screen-2xl shadow outline-none p-3'
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
