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

export default function EditorMobileMenu({
  editor,
  notes,
}: {
  editor: Editor;
  notes: Note[] | undefined;
}) {
  return (
    <TooltipProvider>
      <nav className="fixed opacity-75 hover:opacity-100 rounded-md transition-opacity duration-300 z-50 bottom-4 left-1/2 transform -translate-x-1/2 bg-bermuda-gray-950 text-white text-sm px-4 py-1.5 flex items-center justify-center space-x-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <NavDrawer notes={notes} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Navigation</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/"}>Home</Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => editor.chain().focus().setAiWriter().run()}>
              Ai Writer
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert AI Writer</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
