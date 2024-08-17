import { Button } from '../ui/button';
import { useState, useEffect, FormEvent } from 'react';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { MagicWandIcon, StopIcon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/core';
import { copyToClipboard } from '../../lib/helpers/copy-to-clipboard';
import { cn } from '../../lib/utils';

export default function AiPromptForm({ editor }: { editor: Editor }) {
  const [prompt, setPrompt] = useState('');
  const [lastSelectedText, setLastSelectedText] = useState('');
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const { completion, isLoading, complete, stop } = useCompletion({
    api: '/api/assistant',
    onError: () => {
      toast.error('Failed to execute action');
      restoreOriginalText();
    },
  });

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

  const restoreOriginalText = () => {
    if (selectionFrom !== null && selectionTo !== null) {
      editor?.commands.command(({ tr }) => {
        tr.insertText(lastSelectedText, selectionFrom, selectionTo);
        return true;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await complete(lastSelectedText, {
        body: { selectedText: lastSelectedText, action: prompt },
      });
      setPrompt('');
    }
  };

  const insertGeneratedContentAtCursor = () => {
    if (completion && editor) {
      editor.commands.insertContent(completion);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow flex flex-col min-h-0 overflow-hidden'>
        <div
          className={cn(
            'w-full flex-grow overflow-y-auto text-sm shadow-inner border border-quarter-spanish-white-200 rounded-lg p-2 bg-quarter-spanish-white-50',
            !completion && 'opacity-50'
          )}
        >
          {completion}
        </div>
        {completion && (
          <div className='flex space-x-2 mt-2'>
            {selectionFrom && selectionTo && (
              <Button
                variant={'menu'}
                size={'sm'}
                className='rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50'
                onClick={() =>
                  editor.commands.command(({ tr }) => {
                    tr.replaceWith(
                      selectionFrom,
                      selectionTo,
                      editor.schema.text(completion)
                    );
                    return true;
                  })
                }
              >
                Replace
              </Button>
            )}
            <Button
              variant={'menu'}
              size={'sm'}
              className='rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50'
              onClick={insertGeneratedContentAtCursor}
            >
              Insert
            </Button>
            <Button
              variant={'menu'}
              size={'sm'}
              className='rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50'
              onClick={async () => await copyToClipboard(completion)}
            >
              Copy
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className='w-full flex items-end space-x-1 mt-3'
        onFocus={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          name='aiPrompt'
          id='aiPrompt'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='w-full p-2 bg-quarter-spanish-white-50 outline-none rounded-md'
          placeholder='AI prompt'
          spellCheck='false'
          autoComplete='off'
        />
        <Button
          variant={'menu'}
          type='submit'
          onClick={isLoading ? stop : undefined}
        >
          <span className='sr-only'>Submit</span>
          {isLoading ? <StopIcon /> : <MagicWandIcon />}
        </Button>
      </form>
    </div>
  );
}
