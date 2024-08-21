import { isTextSelection } from "@tiptap/core";
import { Editor } from "@tiptap/react";

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  // Doubleclick an empty paragraph returns a node size of 2.
  // Needs to check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export default isTextSelected;
