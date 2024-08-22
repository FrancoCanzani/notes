import AiWriter from "../extensions/ai-writer-extension";
import ImageResize from "tiptap-extension-resize-image";
import { Editor } from "@tiptap/core";

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [AiWriter.name, ImageResize.name];

  return customNodes.some((type) => editor.isActive(type));
};
