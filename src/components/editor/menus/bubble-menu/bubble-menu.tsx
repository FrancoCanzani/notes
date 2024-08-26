import { Editor } from "@tiptap/core";
import { BubbleMenu as Bubble } from "@tiptap/react";
import { Button } from "../../../ui/button";
import {
  TextB,
  TextAUnderline,
  TextItalic,
  TextStrikethrough,
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
            <TextB size={20} />
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
            <TextItalic size={20} />
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
            <TextAUnderline size={20} />
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
            <TextStrikethrough size={20} />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="m23.625 3.063l-.719.624L7.563 17l-.5.469l.25.656s1.125 3-1.032 5.156v.032l-.031.03l-.156.188l-.125.125L2 27.531L7.375 29l2.063-2.063l.218-.187l.031-.031h.032c2.156-2.157 5.156-1.032 5.156-1.032l.656.25l.469-.5l13.313-15.343l.625-.719zm-.125 2.75L27.188 9.5l-8.75 10.063l-5-5zM11.937 15.874l5.188 5.188l-1.938 2.25l-5.5-5.5zM9.563 20.5l2.937 2.938c-1.242.046-2.746.437-4.156 1.812c-.02.02-.043.012-.063.031l-.25.219l-.531-.531l.219-.25l.031-.063c1.375-1.41 1.766-2.914 1.813-4.156"
              />
            </svg>
          </Button>
          <BubbleMenuJustifyOptions editor={editor} />
        </Bubble>
      )}
    </div>
  );
}
