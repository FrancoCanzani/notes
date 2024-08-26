import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import getAutocompleteSuggestion from '../helpers/decide-autocomplete';
import { getPrevText } from '../helpers/get-prev-text';
import { StreamableValue, readStreamableValue } from 'ai/rsc';
import { toast } from 'sonner';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    autocomplete: {
      triggerAutocomplete: () => ReturnType;
    };
  }
}

export const AutocompleteExtension = Extension.create({
  name: 'autocomplete',

  addOptions() {
    return {
      suggestion: getAutocompleteSuggestion,
      getPrompt: (text: string) => text.split(' ').slice(-5).join(' '),
      maxChars: 500,
    };
  },

  addCommands() {
    return {
      triggerAutocomplete:
        () =>
        ({ editor }) => {
          const { state } = editor;

          const prevText = getPrevText(editor, {
            chars: this.options.maxChars,
          });

          const prompt = this.options.getPrompt(prevText);

          return this.options
            .suggestion(prompt)
            .then(async (response: StreamableValue<string>) => {
              if (response) {
                const reader = readStreamableValue(response);
                let fullText = '';

                for await (const chunk of reader) {
                  if (typeof chunk === 'string' && chunk !== fullText) {
                    const newContent = chunk.slice(fullText.length);
                    fullText = chunk;
                    if (newContent) {
                      editor.commands.insertContent(newContent);
                    }
                  }
                }

                return true;
              } else {
                return false;
              }
            })
            .catch((error: unknown) => {
              if (error instanceof Error) {
                toast.error('Error getting AI autocomplete suggestion');
              } else {
                toast.error('An unknown error occurred');
              }
              return false;
            });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('autocomplete'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              this.editor.commands.triggerAutocomplete();
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

export default AutocompleteExtension;
