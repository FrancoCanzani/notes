'use client';

import { useEffect } from 'react';
import { extensions } from '../lib/extensions';
import { cn } from '../lib/utils';
import { Skeleton } from './ui/skeleton';
import { EditorContent, useEditor } from '@tiptap/react';
import { toast } from 'sonner';

export default function NoteEditorPreview({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions,
    editable: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  useEffect(() => {
    try {
      editor?.commands.setContent(JSON.parse(content));
    } catch (error) {
      toast.error('Error getting preview editor content!');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className='flex flex-col grow space-y-2 py-2'>
        <Skeleton className='h-4 w-full bg-gray-200' />
        <Skeleton className='h-4 w-[80%] bg-gray-200' />
        <Skeleton className='h-4 w-[65%] bg-gray-200' />
      </div>
    );
  }

  return <EditorContent className={cn(className)} editor={editor} />;
}
