import { Editor } from '@tiptap/core';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function AiSidebarActions({
  editor,
}: {
  editor: Editor | null;
}) {
  const [lastSelectedText, setLastSelectedText] = useState('');
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const { complete, completion, error } = useCompletion({
    api: '/api/ai',
    onError: () => {
      toast.error('Failed to execute action');
      restoreOriginalText();
    },
  });

  const options = [
    {
      value: 'improve',
      label: 'Improve writing',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='0.85rem'
          height='0.85rem'
          viewBox='0 0 16 16'
        >
          <path
            fill='currentColor'
            d='M2.75 2.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zm1.69 9.935l.936-.935H2.75a.75.75 0 0 0 0 1.5h1.334c.072-.206.191-.4.356-.565M2.75 8.5H6c0 .637.4 1.19.973 1.405L6.878 10H2.75a.75.75 0 0 1 0-1.5m0-3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zm8.246-.061a.5.5 0 0 0-.992 0l-.09.734a2 2 0 0 1-1.741 1.74l-.734.09a.5.5 0 0 0 0 .993l.734.09a2 2 0 0 1 1.74 1.741l.09.734a.5.5 0 0 0 .993 0l.09-.734a2 2 0 0 1 1.741-1.74l.734-.09a.5.5 0 0 0 0-.993l-.734-.09a2 2 0 0 1-1.74-1.741zm-2.142 4.708a.5.5 0 0 1 0 .707l-3 2.996a.5.5 0 1 1-.707-.707l3-2.997a.5.5 0 0 1 .707 0'
          />
        </svg>
      ),
    },

    {
      value: 'fix',
      label: 'Fix grammar',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='0.85rem'
          height='0.85rem'
          viewBox='0 0 24 24'
        >
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M14 9a3 3 0 1 0 6 0a3 3 0 0 0-6 0M4 12V7a3 3 0 1 1 6 0v5M4 9h6m10-3v6M4 16h12M4 20h6m4 0l2 2l5-5'
          />
        </svg>
      ),
    },
    {
      value: 'shorter',
      label: 'Make shorter',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='0.85rem'
          height='0.85rem'
          viewBox='0 0 24 24'
        >
          <path fill='currentColor' d='M4 15v-2h10v2zm0-4V9h16v2z' />
        </svg>
      ),
    },
    {
      value: 'longer',
      label: 'Make longer',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='0.85rem'
          height='0.85rem'
          viewBox='0 0 24 24'
        >
          <path
            fill='currentColor'
            d='M4 5h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4z'
          />
        </svg>
      ),
    },
  ];

  if (!editor) {
    return;
  }

  const updateSelectedText = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    setSelectionFrom(from);
    setSelectionTo(to);

    if (text) {
      setLastSelectedText(text);
    }
  };

  useEffect(() => {
    editor.on('selectionUpdate', updateSelectedText);
    return () => {
      editor.off('selectionUpdate', updateSelectedText);
    };
  }, [editor]);

  useEffect(() => {
    if (completion && selectionFrom !== null && selectionTo !== null) {
      editor.commands.command(({ tr }) => {
        tr.replaceWith(
          selectionFrom,
          selectionTo,
          editor.schema.text(completion)
        );
        return true;
      });
    }
  }, [completion]);

  const restoreOriginalText = () => {
    if (selectionFrom !== null && selectionTo !== null) {
      editor?.commands.command(({ tr }) => {
        tr.insertText(lastSelectedText, selectionFrom, selectionTo);
        return true;
      });
    }
  };

  const handleClick = async (command: string) => {
    const text = window.getSelection()?.toString();
    if (text) {
      await complete(text, {
        body: { option: command },
      });

      if (error) {
        toast.error('Failed to execute command');
        return;
      }
    }
  };

  return (
    <ul className='space-y-2'>
      <h3 className='font-medium'>Ai Menu</h3>
      <p className='font-medium text-xs'>Select text to apply actions</p>
      {options.map((option) => (
        <button
          onClick={() => {
            handleClick(option.value);
          }}
          className='flex disabled:opacity-50 hover:bg-quarter-spanish-white-200 bg-quarter-spanish-white-50 p-2.5 rounded-lg w-full text-sm disabled:cursor-not-allowed items-center justify-start gap-x-2'
          key={option.value}
          disabled={window.getSelection()?.toString().length === 0}
        >
          {option.icon} {option.label}
        </button>
      ))}
    </ul>
  );
}
