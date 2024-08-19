import EditorOptionsDropdown from "./editor-options-dropdown";
import { formatRelative } from "date-fns";
import NavDrawer from "../nav-drawer";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Note } from "../../lib/types";
import { Editor } from "@tiptap/core";
import { DebouncedState } from "use-debounce";

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
  const handleTitleChange = useCallback(
    (input: string) => {
      setTitle(input);
      if (editor && input.trim().length > 0) {
        debouncedUpdates(editor);
      }
    },
    [editor, debouncedUpdates]
  );

  return (
    <div className="w-full text-gray-600 text-xs overflow-x-clip flex items-center justify-between py-4 gap-x-2">
      <div className="flex max-w-[50%] items-center justify-start gap-x-2">
        <NavDrawer notes={notes} />
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => handleTitleChange(e.target.value)}
          value={title}
          autoFocus
          className="font-medium text-xl bg-bermuda-gray-50 outline-none"
          aria-label="Note title"
        />
      </div>
      <div className="flex items-center justify-end gap-x-2 md:gap-x-3">
        {note && (
          <>
            <span className="text-gray-400 capitalize block text-sm">
              {formatRelative(new Date(note.lastSaved), new Date())}
            </span>
            <EditorOptionsDropdown note={note} editor={editor} />
          </>
        )}
      </div>
    </div>
  );
}
