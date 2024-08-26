import { Editor } from "@tiptap/core";
import { BubbleMenu as Bubble } from "@tiptap/react";
import { Button } from "../../../ui/button";
import {
  TextB,
  TextAUnderline,
  TextItalic,
  TextStrikethrough,
  Highlighter,
} from "@phosphor-icons/react";
import isMobile from "../../../../lib/helpers/is-mobile";
import { cn } from "../../../../lib/utils";
import isTextSelected from "../../../../lib/helpers/is-text-selected";
import { useCallback } from "react";
import { isCustomNodeSelected } from "../../../../lib/helpers/is-custom-node-selected";
import { EditorView } from "@tiptap/pm/view";
import BubbleMenuJustifyOptions from "./bubble-menu-justify-options";
import BubbleMenuLink from "./bubble-menu-link";
import BubbleMenuAiActions from "./bubble-menu-ai-actions";

export default function BubbleMenu({ editor }: { editor: Editor }) {
  const usesMobile = isMobile();

  const shouldShow = useCallback(
    ({ view, from }: { view: EditorView; from: number }) => {
      if (!view || editor.view.dragging || usesMobile) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected({ editor });
    },
    [editor]
  );

  return (
    <div>
      {editor && (
        <Bubble
          editor={editor}
          shouldShow={shouldShow}
          tippyOptions={{
            duration: 100,
            placement: usesMobile ? "bottom" : "top",
          }}
          className="flex shadow items-center gap-x-0.5 rounded-sm text-xs bg-bermuda-gray-50 p-0.5"
        >
          <BubbleMenuAiActions editor={editor} />
          <Button
            variant={"menu"}
            size={"sm"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold")
                ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
                : ""
            }
            aria-label="bold"
            title="Bold"
          >
            <TextB size={19} />
          </Button>
          <Button
            variant={"menu"}
            size={"sm"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
                : ""
            }
            aria-label="italic"
            title="Italic"
          >
            <TextItalic size={19} />
          </Button>
          <Button
            variant={"menu"}
            size={"sm"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
                : ""
            }
            aria-label="underline"
            title="Underline"
          >
            <TextAUnderline size={19} />
          </Button>
          <Button
            variant={"menu"}
            size={"sm"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={
              editor.isActive("strike")
                ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
                : ""
            }
            aria-label="strike"
            title="Strike"
          >
            <TextStrikethrough size={19} />
          </Button>
          <BubbleMenuLink editor={editor} />
          <Button
            variant={"menu"}
            size={"sm"}
            title="Highlight"
            onClick={() =>
              editor.isActive("highlight")
                ? editor.chain().focus().unsetHighlight().run()
                : editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#FFD465" })
                    .run()
            }
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            className={cn(
              "bg-[#FFD465]/50 hover:bg-[#FFD465]",
              editor.isActive("highlight") ? "font-bold bg-[#FFD465]" : ""
            )}
            aria-label="highlight"
          >
            <Highlighter size={19} />
          </Button>
          <BubbleMenuJustifyOptions editor={editor} />
        </Bubble>
      )}
    </div>
  );
}
