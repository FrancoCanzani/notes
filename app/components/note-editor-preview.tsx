import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '../lib/utils';

const extensions = [
  Color.configure({}),
  TextStyle.configure({}),
  ListItem,
  Underline,
  Highlight.configure({ multicolor: true }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
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
