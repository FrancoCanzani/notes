'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { extensions } from '../lib/extensions';

export default function NoteEditorPreview({
  content,
  className,
}: {
  content: any;
  className?: string;
}) {
  const editor = useEditor({
    editable: false,
    extensions,
  });

  editor?.commands.setContent(JSON.parse(content));

  return <EditorContent editor={editor} className={cn(className)} />;
}
