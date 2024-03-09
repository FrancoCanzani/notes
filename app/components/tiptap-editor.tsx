'use client';

import MenuBar from './menu-bar';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

const extensions = [
  Color.configure({}),
  TextStyle.configure({}),
  ListItem,
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

export default () => {
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
    if (!editor) return;

    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleLocalStorageChange = () => {
      localStorage.setItem('editorContent', editor.getHTML());
    };

    editor.on('update', handleLocalStorageChange);

    return () => {
      editor.off('update', handleLocalStorageChange);
    };
  }, [editor]);

  return (
    <div className='space-y-4 py-6'>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className='relative min-h-[600px] rounded-md w-full sm:max-w-screen-lg border-muted shadow outline-none p-3'
      />
    </div>
  );
};
