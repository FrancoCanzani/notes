import React, { KeyboardEvent } from 'react';
import { Editor, Range, Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { Bold, Heading1, Italic, List, ListOrdered, Text } from 'lucide-react';
import { Command as Cmdk } from 'cmdk';

interface Command {
  editor: Editor;
  range: Range;
}

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
      icon: <Heading1 size={18} />,
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
      icon: <Text size={18} />,
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
      title: 'Bold',
      description: 'Make text bold.',
      icon: <Bold size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark('bold').run();
      },
    },
    {
      title: 'Italic',
      description: 'Make text italic.',
      icon: <Italic size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark('italic').run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: <List size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
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
  command: (item: any) => void;
}

// Enter event work differently in a class component compared to a functional component with Tiptap editor.
// In Class Components Event handlers are defined as methods within the class. These methods have access to the component's state (this.state) directly.
// When you bind the event handler to the element in the render method, you're passing the entire method reference.

class CommandList extends React.Component<
  CommandListProps,
  { selectedIndex: number }
> {
  state = {
    selectedIndex: 0,
  };

  componentDidUpdate(oldProps: Readonly<CommandListProps>) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown({ event }: { event: KeyboardEvent<HTMLDivElement> }) {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        (this.state.selectedIndex + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index: number) {
    const item = this.props.items[index];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <Cmdk>
        <Cmdk.List className='z-50 no-scrollbar h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border bg-white px-1 py-2 shadow transition-all'>
          {items.map((item, index) => {
            const isSelected = index === this.state.selectedIndex;
            return (
              <Cmdk.Item
                key={index}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 ${
                  isSelected ? 'bg-gray-100 text-gray-900' : ''
                }`}
                onClick={() => this.selectItem(index)}
              >
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-xs text-gray-500'>{item.description}</p>
                </div>{' '}
              </Cmdk.Item>
            );
          })}
        </Cmdk.List>
      </Cmdk>
    );
  }
}

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