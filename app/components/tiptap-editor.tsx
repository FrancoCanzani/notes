'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import MenuBar from './menu-bar';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

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

const Editor = () => {
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
    if (!editor) {
      return;
    }
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const handleLocalStorageChange = () => {
      localStorage.setItem('editorContent', editor.getHTML());
    };

    editor.on('update', handleLocalStorageChange);

    return () => {
      editor.off('update', handleLocalStorageChange);
    };
  }, [editor]);

  return (
    <form className='space-y-4 py-6 px-3'>
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
    </form>
  );
};

export default Editor;
