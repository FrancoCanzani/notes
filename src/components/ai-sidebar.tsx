'use client';

import { Editor } from '@tiptap/core';
import AiPromptForm from './editor/ai-prompt-form';
import AiSidebarActions from './ai-sidebar-actions';
import { Separator } from './ui/separator';

export default function AiSidebar({ editor }: { editor: Editor }) {
  return (
    <div className='bg-quarter-spanish-white-100 w-[22rem] flex-shrink-0 flex-grow-0 space-y-3 flex-col justify-between hidden lg:flex p-5 h-screen sticky top-0 right-0 overflow-y-auto'>
      <AiSidebarActions editor={editor} />
      <Separator className='bg-quarter-spanish-white-200' />
      <AiPromptForm editor={editor} />
    </div>
  );
}
