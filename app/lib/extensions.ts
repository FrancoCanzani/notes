import { Color } from '@tiptap/extension-color';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import SlashCommand from '../components/slash-command';

export const extensions = [
  Color,
  TextStyle,
  Link,
  TaskItem,
  Underline,
  Highlight,
  CharacterCount,
  TaskList,
  StarterKit,
  Placeholder.configure({
    // Not sure what the type of node is, so I'm using any
    placeholder: ({ node }: any) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands, or enter some text...";
    },
    includeChildren: true,
  }),
  SlashCommand,
];
