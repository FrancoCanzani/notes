'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import { PartialBlock, BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/react';
import { Skeleton } from './ui/skeleton';

export default function NoteEditorPreview({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | 'loading'
  >('loading');

  useEffect(() => {
    try {
      const parsedContent = JSON.parse(content) as PartialBlock[];
      console.log(initialContent);

      setInitialContent(parsedContent);
    } catch (error) {
      setInitialContent([]);
    }
  }, [content]);

  const editor = useMemo(() => {
    if (initialContent === 'loading') {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined || initialContent === 'loading') {
    return (
      <div className='flex flex-col grow space-y-2 py-2'>
        <Skeleton className='h-4 w-full bg-gray-200' />
        <Skeleton className='h-4 w-[80%] bg-gray-200' />
        <Skeleton className='h-4 w-[65%] bg-gray-200' />
      </div>
    );
  }

  return (
    <BlockNoteView className={cn(className)} editor={editor} editable={false} />
  );
}
