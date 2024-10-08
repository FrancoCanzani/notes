'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { extensions } from '../../lib/extensions/extensions';
import { useDebouncedCallback } from 'use-debounce';
import { saveNote } from '../../lib/actions';
import { Note } from '../../lib/types';
import { toast } from 'sonner';
import { EditorContent, useEditor } from '@tiptap/react';
import { defaultEditorProps } from '../../lib/editor-props';
import { useAuth } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import BubbleMenu from './menus/bubble-menu/bubble-menu';
import EditorHeader from './editor-header';
import WordCount from './word-count';
import { createHandleImageDeletion } from '../../lib/helpers/handle-image-deletion';

export default function Editor({
  noteId,
  note,
  notes,
}: {
  noteId: string;
  note?: Note;
  notes?: Note[];
}) {
  const [title, setTitle] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const { userId } = useAuth();
  const handleImageDeletion = createHandleImageDeletion();

  const editor = useEditor({
    parseOptions: {
      preserveWhitespace: true,
    },
    editorProps: useMemo(() => ({ ...defaultEditorProps }), []),
    extensions: [...extensions],
    onUpdate: ({ editor }) => {
      handleImageDeletion({ editor });
      debouncedUpdates(editor);
    },
  });

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    try {
      setIsSaved(false);
      const content = editor.getJSON();
      if (userId) {
        await saveNote(userId, noteId, title, JSON.stringify(content));
      }
      if (notes && !notes.some((note) => note.id === noteId)) {
        window.location.reload();
      }
      setIsSaved(true);
    } catch (error) {
      setIsSaved(false);
      toast.error('Failed to save note. Please try again.');
    }
  }, 1000);

  useEffect(() => {
    if (editor && noteId) {
      const loadNote = async () => {
        try {
          if (note) {
            const { title: storedTitle, content } = note;
            setTitle(storedTitle);
            editor.commands.setContent(content ? JSON.parse(content) : '');
          } else {
            setTitle(`New note - ${noteId}`);
            editor.commands.setContent('');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          toast.error('Error loading note.');
        }
      };
      loadNote();
    }
  }, [noteId, editor, note]);

  if (!editor) {
    return (
      <div className='grow m-auto bg-bermuda-gray-50 min-h-screen container flex items-center justify-center'>
        <Loader
          className='animate-spin text-gray-400'
          size={26}
          aria-label='Loading editor'
        />
      </div>
    );
  }

  return (
    <main className='h-screen flex flex-col overflow-hidden'>
      <EditorHeader
        debouncedUpdates={debouncedUpdates}
        editor={editor}
        note={note}
        notes={notes}
        setTitle={setTitle}
        title={title}
        isSaved={isSaved}
      />
      <div className='flex-grow overflow-hidden'>
        <div className='h-full overflow-y-auto'>
          <div className='mx-auto pb-6 max-w-3xl px-3'>
            <BubbleMenu editor={editor} />
            <EditorContent
              editor={editor}
              className='mx-auto py-4 focus:outline-none'
            />
            <WordCount editor={editor} />
          </div>
        </div>
      </div>
    </main>
  );
}
