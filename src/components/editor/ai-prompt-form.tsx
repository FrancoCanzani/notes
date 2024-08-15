import { Button } from '../ui/button';
import { useState, useEffect, FormEvent } from 'react';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { MagicWandIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/core';

export default function AiPromptForm({ editor }: { editor: Editor }) {
  const [prompt, setPrompt] = useState('');
  const [lastSelectedText, setLastSelectedText] = useState('');
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const { completion, isLoading, complete } = useCompletion({
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      prompt.trim() &&
      lastSelectedText &&
      selectionFrom !== null &&
      selectionTo !== null
    ) {
      await complete(lastSelectedText, {
        body: { selectedText: lastSelectedText, action: prompt },
      });
      setPrompt('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full flex items-center space-x-1'
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
      <Button variant={'menu'} size={'sm'} type='submit' disabled={isLoading}>
        <span className='sr-only'>Submit</span>
        {isLoading ? (
          <UpdateIcon className='animate-spin' />
        ) : (
          <MagicWandIcon />
        )}
      </Button>
    </form>
  );
}
