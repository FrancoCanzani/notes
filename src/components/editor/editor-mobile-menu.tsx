import React from "react";
import NavDrawer from "../nav-drawer";
import { Note } from "../../lib/types";
import { Editor } from "@tiptap/core";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  FileIcon,
  HomeIcon,
  MagicWandIcon,
  ImageIcon,
} from "@radix-ui/react-icons";

export default function EditorMobileMenu({
  editor,
  notes,
}: {
  editor: Editor;
  notes: Note[] | undefined;
}) {
  return (
    <TooltipProvider>
      <nav className="fixed sm:hidden opacity-65 hover:opacity-100 rounded-md transition-opacity duration-300 z-50 bottom-4 left-1/2 transform -translate-x-1/2 bg-bermuda-gray-950 text-white text-sm px-6 py-3 shadow-inner flex items-center justify-center space-x-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <NavDrawer notes={notes}>
              <FileIcon className="cursor-pointer" />
            </NavDrawer>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Navigation</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/"}>
              <HomeIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => editor.chain().focus().setAiWriter().run()}>
              <MagicWandIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert AI Writer</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <ImageIcon />
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert image</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
