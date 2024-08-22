import { useState } from "react";
import EditorOptionsDropdown from "./editor-options-dropdown";
import { formatRelative } from "date-fns";
import NavDrawer from "../nav-drawer";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Note } from "../../lib/types";
import { Editor } from "@tiptap/core";
import { DebouncedState } from "use-debounce";
import { Button } from "../ui/button";

interface EditorHeaderProps {
  notes: Note[] | undefined;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  editor: Editor;
  note: Note | undefined;
  debouncedUpdates: DebouncedState<(editor: any) => Promise<void>>;
}

export default function EditorHeader({
  notes,
  title,
  setTitle,
  editor,
  note,
  debouncedUpdates,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const addAiWriterNode = () => {
    if (editor) {
      editor.chain().focus().setAiWriter().run();
    }
  };

  const handleTitleChange = useCallback(
    (input: string) => {
      setTitle(input);
      if (editor && input.trim().length > 0) {
        debouncedUpdates(editor);
      }
    },
    [editor, debouncedUpdates, setTitle]
  );

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full supports-backdrop-blur:bg-bermuda-gray/90 sticky top-0 z-40 bg-bermuda-gray/40 backdrop-blur-lg">
      <div className="max-w-4xl mx-auto px-2 py-3 text-gray-600 text-xs overflow-x-clip flex items-center justify-between">
        <div className="flex max-w-[50%] items-center justify-start gap-x-2">
          <NavDrawer notes={notes} />
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className="font-medium text-xl outline-none bg-transparent"
              aria-label="Note title"
            />
          ) : (
            <p
              onClick={handleTitleClick}
              className="font-medium text-xl outline-none bg-transparent cursor-pointer truncate"
            >
              {title || "Untitled"}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-x-2 md:gap-x-3">
          {note && (
            <>
              <span className="text-gray-400 capitalize block text-sm">
                {formatRelative(new Date(note.lastSaved), new Date())}
              </span>
              <Button
                variant={"menu"}
                size={"sm"}
                onClick={addAiWriterNode}
                className="rounded-sm"
              >
                AI Writer
              </Button>
              <EditorOptionsDropdown note={note} editor={editor} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
