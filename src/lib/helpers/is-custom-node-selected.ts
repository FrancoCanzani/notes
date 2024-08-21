import AiWriter from "../extensions/ai-writer-extension";
import { Editor } from "@tiptap/core";

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [AiWriter.name];

  return customNodes.some((type) => editor.isActive(type));
};
