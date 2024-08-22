import { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { options } from "../../../../lib/constants/ai-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

export default function BubbleMenuAiActions({ editor }: { editor: Editor }) {
  const [lastSelectedText, setLastSelectedText] = useState("");
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const { complete, completion, error, isLoading } = useCompletion({
    api: "/api/aiActions",
    onError: () => {
      toast.error("Failed to execute action");
      restoreOriginalText();
    },
  });

  console.log(window.getSelection()?.toString().length);

  if (!editor) {
    return;
  }

  const updateSelectedText = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    setSelectionFrom(from);
    setSelectionTo(to);

    if (text) {
      setLastSelectedText(text);
    }
  };

  useEffect(() => {
    editor.on("selectionUpdate", updateSelectedText);
    return () => {
      editor.off("selectionUpdate", updateSelectedText);
    };
  }, [editor]);

  useEffect(() => {
    if (completion && selectionFrom !== null && selectionTo !== null) {
      editor.commands.command(({ tr }) => {
        tr.replaceWith(
          selectionFrom,
          selectionTo,
          editor.schema.text(completion)
        );
        return true;
      });
    }
  }, [completion]);

  const restoreOriginalText = () => {
    if (selectionFrom !== null && selectionTo !== null) {
      editor?.commands.command(({ tr }) => {
        tr.insertText(lastSelectedText, selectionFrom, selectionTo);
        return true;
      });
    }
  };

  const handleClick = async (command: string) => {
    const text = window.getSelection()?.toString();
    if (text) {
      await complete(text, {
        body: { option: command },
      });

      if (error) {
        toast.error("Failed to execute command");
        return;
      }
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-bermuda-gray-200 border-bermuda-gray-50 border p-1 rounded-sm font-medium">
          Ai Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={5}
          className="z-50"
        >
          {options.map((option) => (
            <DropdownMenuItem
              onClick={() => {
                handleClick(option.value);
              }}
              className="flex disabled:opacity-50 my-1 hover:bg-bermuda-gray-200 bg-bermuda-gray-50 p-1.5 rounded-sm w-full text-sm items-center justify-start gap-x-2"
              key={option.value}
              disabled={
                window.getSelection()?.toString().length === 0 || isLoading
              }
            >
              {option.icon} {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
