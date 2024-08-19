"use client";

import { extensions } from "../../lib/extensions";
import { useEffect, useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { saveNote } from "../../lib/actions";
import { Note } from "../../lib/types";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import { defaultEditorProps } from "../../lib/editor-props";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import BubbleMenuTest from "./bubble-menu-test";
import AiSidebar from "../ai-sidebar";
import EditorHeader from "./editor-header";

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
      const updateListener = editor.on("update", ({ editor }) => {
        debouncedUpdates(editor);
      });

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
    <main className="flex h-screen overflow-hidden">
      <div className="flex-grow overflow-auto thin-scrollbar bg-bermuda-gray-50 w-full">
        <div className="flex flex-col container max-w-4xl mx-auto px-4">
          <EditorHeader
            debouncedUpdates={debouncedUpdates}
            editor={editor}
            note={note}
            notes={notes}
            setTitle={setTitle}
            title={title}
          />
          <div className="w-full m-auto pb-4">
            <BubbleMenuTest editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
      <AiSidebar editor={editor} />
    </main>
  );
}
