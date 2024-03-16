'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import handleLocalStorageSave from '../lib/helpers/handle-local-storage-save';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const extensions = [
  Color.configure({}),
  TextStyle.configure({}),
  ListItem,
  Underline,
  Highlight.configure({ multicolor: true }),
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

export default function Editor({ noteId }: { noteId: string }) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const [saveStatus, setSaveStatus] = useState('Saved');

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
    const note = window.localStorage.getItem(`note_${noteId}`);
    if (note) {
      const { title: storedTitle, content } = JSON.parse(note);
      setTitle(storedTitle);
      editor?.commands.setContent(JSON.parse(content));
    }
  }, [editor, noteId]);

  // const session = useSession();
  // const user = session.data?.user;

  // the callback function will be called only after x milliseconds since the last invocation
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    handleLocalStorageSave(noteId, title, JSON.stringify(json));
    setSaveStatus('Saved');
    toast(saveStatus);
  }, 1000);

  if (!editor) return;
  editor.on('update', ({ editor }) => {
    debouncedUpdates(editor);
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
        className='relative bg-gray-50 rounded-sm w-full sm:max-w-screen-xl shadow outline-none px-3 py-2'
      />
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className='relative min-h-[550px] rounded-sm w-full sm:max-w-screen-xl shadow outline-none p-3'
      />
    </div>
  );
}
