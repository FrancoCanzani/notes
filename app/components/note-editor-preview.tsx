import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '../lib/utils';

const extensions = [
  Color,
  TextStyle,
  Link,
  BulletList,
  ListItem,
  TaskList,
  TaskItem,
  Underline,
  Highlight,
  CharacterCount,
  TaskList,
  Heading.configure({
    levels: [1],
  }),
  StarterKit,
];

// todo: get the content type
export default function NoteEditorPreview({
  content,
  className,
}: {
  content: any;
  className?: string;
}) {
  const editor = useEditor({
    editable: false,
    extensions,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  editor?.commands.setContent(JSON.parse(content));

  return <EditorContent editor={editor} className={cn(className)} />;
}
