import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import SlashCommand from "../../components/editor/slash-command";
import Placeholder from "@tiptap/extension-placeholder";
import SearchAndReplace from "@sereneinserenade/tiptap-search-and-replace";
import Image from "@tiptap/extension-image";
import HardBreak from "@tiptap/extension-hard-break";
import { Markdown } from "tiptap-markdown";
import AiWriter from "./ai-writer-extension";
import Selection from "./selection-extension";
import TextAlign from "@tiptap/extension-text-align";

export const extensions = [
  Color,
  TextStyle,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
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
  AiWriter,
  Selection,
  SearchAndReplace.configure(),
  Placeholder.configure({
    placeholder: "Press '/' for commands. Select text for styles.",
  }),
];
