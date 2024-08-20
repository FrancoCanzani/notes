import { mergeAttributes, Node, Editor } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";
import AiWriter from "../../components/editor/ai-writer";

export interface AiWriterOptions {
  HTMLAttributes?: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiWriter: {
      setAiWriter: () => ReturnType;
    };
  }
}

export const AiWriterExtension = Node.create<AiWriterOptions>({
  name: "aiWriter",
  group: "block",
  content: "",
  draggable: true,
  selectable: true,
  atom: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: () => nanoid(7),
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-writer"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes, {
        "data-type": "ai-writer",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setAiWriter:
        () =>
        ({ chain }: { chain: any }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { id: nanoid(7) },
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiWriter);
  },
});

export default AiWriterExtension;
