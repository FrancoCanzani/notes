'use client';

import { useAuth } from '@clerk/nextjs';
import { Editor } from '@tiptap/core';
import { useState } from 'react';
import NewNoteForm from './new-note-form';
import AiPromptForm from './editor/ai-prompt-form';

export default function AiSidebar({ editor }: { editor: Editor }) {
  const [isNewNote, setIsNewNote] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className='bg-quarter-spanish-white-100 flex-col justify-end hidden rounded-l-lg border-l lg:flex w-96 p-5 h-[calc(100vh)]'>
      <AiPromptForm editor={editor} />
    </div>
  );
}
