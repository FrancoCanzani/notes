import React from "react";
import { Editor } from "@tiptap/core";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Button } from "../../ui/button";
import {
  FileIcon,
  HomeIcon,
  MagicWandIcon,
  ImageIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import NavDrawer from "../../nav-drawer";
import { Note } from "../../../lib/types";
import { cn } from "../../../lib/utils";
import BubbleMenuAiActions from "./bubble-menu/bubble-menu-ai-actions";
import BubbleMenuJustifyOptions from "./bubble-menu/bubble-menu-justify-options";
import BubbleMenuLink from "./bubble-menu/bubble-menu-link";

export default function EditorMobileMenu({
  editor,
  notes,
}: {
  editor: Editor;
  notes: Note[] | undefined;
}) {
  return (
    <TooltipProvider>
      <nav className="sm:hidden text-sm py-0.5">
        <div className="flex items-center justify-evenly overflow-x-scroll no-scrollbar gap-x-1.5 px-2">
          <NavDrawer notes={notes}>
            <BarButton icon={<FileIcon />} tooltip="Open Navigation" />
          </NavDrawer>

          <Link href="/">
            <BarButton icon={<HomeIcon />} tooltip="Go to Home" />
          </Link>

          <BubbleMenuAiActions editor={editor} className="border-none" />

          <BarButton
            icon={<MagicWandIcon />}
            tooltip="Insert AI Writer"
            onClick={() => editor.chain().focus().setAiWriter().run()}
          />

          <BarButton
            icon={<ImageIcon />}
            tooltip="Insert image"
            onClick={() => {
              /* Add image insertion logic */
            }}
          />

          <BarButton
            icon={<FontBoldIcon />}
            tooltip="Bold"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          />

          <BarButton
            icon={<FontItalicIcon />}
            tooltip="Italic"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          />

          <BarButton
            icon={<UnderlineIcon />}
            tooltip="Underline"
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          />

          <BarButton
            icon={<StrikethroughIcon />}
            tooltip="Strike"
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          />

          <BubbleMenuLink editor={editor} className={cn("border-none")} />
          <BubbleMenuJustifyOptions
            editor={editor}
            className={cn("border-none")}
          />

          <BarButton
            icon={
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
            }
            tooltip="Highlight"
            isActive={editor.isActive("highlight")}
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
          />
        </div>
      </nav>
    </TooltipProvider>
  );
}

function BarButton({
  icon,
  tooltip,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="menu"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "border-none",
            isActive && "bg-bermuda-gray-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
