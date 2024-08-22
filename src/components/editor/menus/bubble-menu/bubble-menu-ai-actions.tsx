import { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { options } from "../../../../lib/constants/ai-actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../ui/command";
import { Button } from "../../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { cn } from "../../../../lib/utils";

export default function BubbleMenuAiActions({ editor }: { editor: Editor }) {
  const [lastSelectedText, setLastSelectedText] = useState("");
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const { complete, completion, error, isLoading } = useCompletion({
    api: "/api/aiActions",
    onError: () => {
      toast.error("Failed to execute action");
      restoreOriginalText();
    },
  });

  useEffect(() => {
    const updateSelectedText = () => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setSelectionFrom(from);
      setSelectionTo(to);

      if (text) {
        setLastSelectedText(text);
      }
    };

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

  const handleSelect = async (value: string) => {
    if (lastSelectedText) {
      setOpen(false);

      await complete(lastSelectedText, {
        body: { option: value },
      });

      if (error) {
        toast.error("Failed to execute command");
        return;
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="menu"
          size={"sm"}
          className={cn(
            "flex items-center transition-colors duration-300 text-xs justify-start gap-x-1 bg-gradient-to-r from-white hover:via-purple-200 via-purple-100 hover:to-pink-200 to-pink-100",
            isLoading && "animate-pulse"
          )}
        >
          Ai Actions
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] bg-white rounded-sm p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search AI actions..." />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={isLoading}
                  className="cursor-pointer hover:bg-bermuda-gray-100"
                >
                  {option.icon}
                  <span className="ml-2">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
