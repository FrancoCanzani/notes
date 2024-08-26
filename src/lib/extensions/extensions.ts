import { Color } from '@tiptap/extension-color';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import SearchAndReplace from '@sereneinserenade/tiptap-search-and-replace';
import Image from '@tiptap/extension-image';
import HardBreak from '@tiptap/extension-hard-break';
import { Markdown } from 'tiptap-markdown';
import AiWriter from './ai-writer-extension';
import Selection from './selection-extension';
import TextAlign from '@tiptap/extension-text-align';
import ImageResize from 'tiptap-extension-resize-image';
import { Command } from './command-extension';
import getSuggestionItems from '../../components/editor/menus/slash-command/suggestion-items';
import { renderItems } from '../../components/editor/menus/slash-command/render-items';
import { AutocompleteExtension } from './autocomplete-extension';

export const extensions = [
  Color,
  TextStyle,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link.configure({
    autolink: true,
    openOnClick: true,
    linkOnPaste: true,
    defaultProtocol: 'https',
  }),
  Command.configure({
    suggestion: {
      items: getSuggestionItems,
      render: renderItems,
    },
  }),
  AutocompleteExtension,
  HardBreak,
  TaskItem,
  Image,
  ImageResize,
  Underline,
  Highlight,
  Markdown,
  CharacterCount,
  TaskList,
  StarterKit,
  AiWriter,
  Selection,
  SearchAndReplace.configure(),
  Placeholder.configure({
    placeholder: "Press '/' for commands. Select text for styles.",
  }),
];
