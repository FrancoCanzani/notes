import { Button } from "../ui/button";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { MagicWandIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Editor } from "@tiptap/core";
import { copyToClipboard } from "../../lib/helpers/copy-to-clipboard";
import { cn } from "../../lib/utils";
import { Sparkles } from "lucide-react";
import useAutoScroll from "../../lib/hooks/use-auto-scroll";

export default function AiPromptForm({ editor }: { editor: Editor }) {
  const [prompt, setPrompt] = useState("");
  const [lastSelectedText, setLastSelectedText] = useState("");
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const { completion, isLoading, complete, stop } = useCompletion({
    api: "/api/assistant",
    onError: () => {
      toast.error("Failed to execute action");
      restoreOriginalText();
    },
  });

  const scrollRef = useAutoScroll(completion);

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

  const restoreOriginalText = () => {
    if (selectionFrom !== null && selectionTo !== null) {
      editor?.commands.command(({ tr }) => {
        tr.insertText(lastSelectedText, selectionFrom, selectionTo);
        return true;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await complete(lastSelectedText, {
        body: { selectedText: lastSelectedText, action: prompt },
      });
      setPrompt("");
    }
  };

  const insertGeneratedContentAtCursor = () => {
    if (completion && editor) {
      editor.commands.insertContent(completion);
    }
  };

  return (
    <div className="flex flex-col h-1/2">
      <div className="flex-grow flex justify-end flex-col min-h-0">
        {completion ? (
          <div
            ref={scrollRef}
            className={cn(
              "w-full flex max-h-fit flex-col overflow-y-auto no-scrollbar text-sm shadow-inner border border-quarter-spanish-white-200 rounded-lg p-2 bg-quarter-spanish-white-50",
              !completion && "opacity-50"
            )}
          >
            {completion}
          </div>
        ) : (
          <Sparkles
            className={cn("m-auto opacity-65", isLoading && "animate-pulse")}
          />
        )}
        {completion && (
          <div className="flex space-x-2 mt-2">
            {selectionFrom && selectionTo && (
              <Button
                variant={"menu"}
                size={"sm"}
                className="rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50"
                onClick={() =>
                  editor.commands.command(({ tr }) => {
                    tr.replaceWith(
                      selectionFrom,
                      selectionTo,
                      editor.schema.text(completion)
                    );
                    return true;
                  })
                }
              >
                Replace
              </Button>
            )}
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50"
              onClick={insertGeneratedContentAtCursor}
            >
              Insert
            </Button>
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-lg py-1.5 px-2 text-xs bg-quarter-spanish-white-50"
              onClick={async () => await copyToClipboard(completion)}
            >
              Copy
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-end space-x-1 mt-3"
        onFocus={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          name="aiPrompt"
          id="aiPrompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 bg-quarter-spanish-white-50 outline-none rounded-md"
          placeholder="AI prompt"
          spellCheck="false"
          autoComplete="off"
        />
        <Button
          variant={"menu"}
          type="submit"
          onClick={isLoading ? stop : undefined}
        >
          <span className="sr-only">Submit</span>
          {isLoading ? (
            <UpdateIcon className="animate-spin" />
          ) : (
            <MagicWandIcon />
          )}
        </Button>
      </form>
    </div>
  );
}
