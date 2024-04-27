import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Editor, Range, Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

interface Command {
  editor: Editor;
  range: Range;
}

const stopPrevent = <T extends Event>(e: T): T => {
  (e as Event).stopPropagation();
  (e as Event).preventDefault();

  return e;
};

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Task List',
      description: 'Create a task list.',
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
};

interface CommandListProps {
  items: any[];
  command: (...args: any[]) => any;
}

const CommandList = React.forwardRef(
  ({ items, command }: CommandListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      scrollSelectedItemIntoView();
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          stopPrevent(event);
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          stopPrevent(event);
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          stopPrevent(event);
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) setTimeout(() => command(item));
    };

    const scrollSelectedItemIntoView = () => {
      const container = scrollContainerRef.current;
      const selectedItem = container?.querySelector(
        `div:nth-child(${selectedIndex + 1})`
      );
      if (container && selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const selectedItemRect = selectedItem.getBoundingClientRect();

        if (selectedItemRect.bottom > containerRect.bottom) {
          // Scroll down
          container.scrollTop += selectedItemRect.bottom - containerRect.bottom;
        } else if (selectedItemRect.top < containerRect.top) {
          // Scroll up
          container.scrollTop -= containerRect.top - selectedItemRect.top;
        }
      }
    };

    return (
      <div
        ref={scrollContainerRef}
        id='slash-command'
        className='h-auto max-h-[330px] w-72 overflow-y-auto no-scrollbar scroll-smooth rounded-md border border-gray-200 bg-white px-1 py-2 shadow-md transition-all'
      >
        {items.length ? (
          <>
            {items.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 ${
                    isSelected ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                  key={item.title}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onKeyDown={(e) => {
                    e.code === 'Enter' && selectItem(index);
                  }}
                  tabIndex={0}
                >
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-gray-500'>{item.description}</p>
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          <div>
            <div>No result</div>
          </div>
        )}
      </div>
    );
  }
);

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
