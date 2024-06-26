import { Color } from '@tiptap/extension-color';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import SlashCommand from '../components/editor/slash-command';
import Placeholder from '@tiptap/extension-placeholder';
import SearchAndReplace from '@sereneinserenade/tiptap-search-and-replace';
import Image from '@tiptap/extension-image';
import HardBreak from '@tiptap/extension-hard-break';
import { Markdown } from 'tiptap-markdown';

export const extensions = [
  Color,
  TextStyle,
  Link,
  HardBreak,
  TaskItem,
  Image,
  Underline,
  Highlight,
  Markdown,
  CharacterCount,
  TaskList,
  StarterKit,
  SlashCommand,
  SearchAndReplace.configure(),
  Placeholder.configure({
    placeholder: "Press '/' for commands. Select text for styles.",
  }),
];
