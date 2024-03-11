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

  const session = useSession();
  const user = session.data?.user;

  // the callback function will be called only after x milliseconds since the last invocation
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    handleLocalStorageSave(noteId, JSON.stringify(json));
    setSaveStatus('Saved');
  }, 1000);

  useEffect(() => {
    if (!editor) return;
    const content = window.localStorage.getItem(`note_${noteId}`);
    if (content) editor.commands.setContent(JSON.parse(content));
  }, [editor, noteId]);

  if (!editor) return;
  editor.on('update', ({ editor }) => {
    debouncedUpdates(editor);
  });

  return (
    <div className='space-y-4 py-6 px-3'>
      <input
        type='text'
        placeholder='Title'
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
