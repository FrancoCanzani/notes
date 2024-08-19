"use client";

import { Editor } from "@tiptap/core";
import AiPromptForm from "./ai-prompt-form";
import AiSidebarActions from "./ai-sidebar-actions";
import { Separator } from "./ui/separator";
import FileDrop from "./file-drop";

export default function AiSidebar({ editor }: { editor: Editor }) {
  return (
    <div className="w-[22rem] flex-shrink-0 rounded-l-sm border-l flex-grow-0 space-y-3 flex-col justify-between hidden lg:flex p-5 h-screen sticky top-0 right-0 overflow-y-auto">
      <AiSidebarActions editor={editor} />
      <Separator className="bg-bermuda-gray-200" />
      <FileDrop />
      <AiPromptForm editor={editor} />
    </div>
  );
}
