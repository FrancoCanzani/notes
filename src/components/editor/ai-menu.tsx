import { Editor } from '@tiptap/core';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function AiMenu({ editor }: { editor: Editor | null }) {
  const { complete, isLoading } = useCompletion({
    api: '/api/ai',
  });

  const options = [
    {
      value: 'improve',
      label: 'Improve writing',
    },

    {
      value: 'fix',
      label: 'Fix grammar',
    },
    {
      value: 'shorter',
      label: 'Make shorter',
    },
    {
      value: 'longer',
      label: 'Make longer',
    },
  ];

  if (!editor) {
    return;
  }

  const handleClick = useCallback(
    async (command: string) => {
      const text = window.getSelection()?.toString();
      if (text) {
        const completion = await complete(text, {
          body: { option: command },
        });

        if (!completion) {
          toast.error('Failed to execute command');
          return;
        }

        const selection = editor.view.state.selection;
        editor
          .chain()
          .focus()
          .insertContentAt(
            {
              from: selection.from,
              to: selection.to,
            },
            completion
          )
          .run();
      }
    },
    [complete]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading || window.getSelection()?.toString().length === 0}
        className='text-purple-600 p-0 text-xs cursor-pointer font-medium hover:text-purple-800 select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
      >
        Ai Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-white text-sm'>
        {options.map((option) => (
          <DropdownMenuItem
            className='hover:bg-gray-100 rounded-md w-full text-xs cursor-pointer'
            onClick={() => {
              handleClick(option.value);
            }}
            key={option.value}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
