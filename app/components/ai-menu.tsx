import { Editor } from '@tiptap/core';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useCallback } from 'react';

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
    <div className='flex items-center bg-white no-scrollbar shadow justify-start space-x-3 overflow-x-auto py-1 px-2 rounded-md'>
      {options.map((option) => (
        <button
          type='submit'
          onClick={() => {
            handleClick(option.value);
          }}
          className='flex gap-2 px-4'
          key={option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
