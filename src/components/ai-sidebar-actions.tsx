import { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { options } from "../lib/constants/ai-actions";

export default function AiSidebarActions({
  editor,
}: {
  editor: Editor | null;
}) {
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
    <div className="space-y-2">
      <h3 className="font-medium">Ai Menu</h3>
      <p className="font-medium text-xs">Select text to apply actions</p>
      <ScrollArea className="thin-scrollbar h-[225px]">
        {options.map((option) => (
          <button
            onClick={() => {
              handleClick(option.value);
            }}
            className="flex disabled:opacity-50 my-1.5 hover:bg-quarter-spanish-white-200 bg-quarter-spanish-white-50 p-2.5 rounded-lg w-full text-sm disabled:cursor-not-allowed items-center justify-start gap-x-2"
            key={option.value}
            disabled={
              window.getSelection()?.toString().length === 0 || isLoading
            }
          >
            {option.icon} {option.label}
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
