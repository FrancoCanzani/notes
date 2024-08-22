"use client";

import { extensions } from "../../lib/extensions/extensions";
import { useEffect, useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { saveNote } from "../../lib/actions";
import { Note } from "../../lib/types";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import { defaultEditorProps } from "../../lib/editor-props";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import BubbleMenu from "./menus/bubble-menu/bubble-menu";
import EditorHeader from "./editor-header";
import { Editor as EditorCore } from "@tiptap/core";
import WordCount from "./word-count";

export default function Editor({
  noteId,
  note,
  notes,
}: {
  noteId: string;
  note?: Note;
  notes?: Note[];
}) {
  const [title, setTitle] = useState("");
  const { userId } = useAuth();

  const editor = useEditor({
    parseOptions: {
      preserveWhitespace: true,
    },
    editorProps: useMemo(() => ({ ...defaultEditorProps }), []),
    extensions,
  });

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    try {
      const content = editor.getJSON();
      if (userId) {
        await saveNote(userId, noteId, title, JSON.stringify(content));
      }

      if (notes && !notes.some((note) => note.id === noteId)) {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to save note. Please try again.");
    }
  }, 1000);

  useEffect(() => {
    if (editor && noteId) {
      const loadNote = async () => {
        try {
          if (note) {
            const { title: storedTitle, content } = note;
            setTitle(storedTitle);
            editor.commands.setContent(content ? JSON.parse(content) : "");
          } else {
            setTitle(`New note - ${noteId}`);
            editor.commands.setContent("");
          }
        } catch (error) {
          console.error("Error loading note:", error);
          toast.error("Error loading note.");
        }
      };

      loadNote();
    }
  }, [noteId, editor, note]);

  useEffect(() => {
    if (editor) {
      const updateListener = editor.on(
        "update",
        ({ editor }: { editor: EditorCore }) => {
          debouncedUpdates(editor);
        }
      );

      return () => {
        updateListener.destroy();
      };
    }
  }, [editor, debouncedUpdates]);

  if (!editor) {
    return (
      <div className="grow m-auto bg-bermuda-gray-50 min-h-screen container flex items-center justify-center">
        <Loader
          className="animate-spin text-gray-400"
          size={26}
          aria-label="Loading editor"
        />
      </div>
    );
  }

  return (
    <main className="h-screen overflow-auto">
      <div className="mx-auto pt-2 pb-8">
        <EditorHeader
          debouncedUpdates={debouncedUpdates}
          editor={editor}
          note={note}
          notes={notes}
          setTitle={setTitle}
          title={title}
        />
        <BubbleMenu editor={editor} />
        <EditorContent editor={editor} className="max-w-3xl mx-auto px-3" />
        <WordCount editor={editor} />
      </div>
    </main>
  );
}
