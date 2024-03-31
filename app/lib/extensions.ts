import { Color } from '@tiptap/extension-color';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';

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
];