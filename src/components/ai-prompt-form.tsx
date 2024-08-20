import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "./ui/button";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { MagicWandIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Editor } from "@tiptap/core";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";
import { copyToClipboard } from "../lib/helpers/copy-to-clipboard";
import "filepond/dist/filepond.min.css";

export default function AiPromptForm({ editor }: { editor: Editor }) {
  const [lastSelectedText, setLastSelectedText] = useState("");
  const [selectionFrom, setSelectionFrom] = useState<number | null>(null);
  const [selectionTo, setSelectionTo] = useState<number | null>(null);

  const {
    messages,
    handleSubmit,
    isLoading,
    input,
    handleInputChange,
    reload,
  } = useChat({
    api: "/api/aiAssistant",
    onError: () => {
      restoreOriginalText();
      toast.error("Failed to execute action");
    },
  });

  const updateSelectedText = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    setSelectionFrom(from);
    setSelectionTo(to);

    if (text) {
      setLastSelectedText(text);
    }
  };

  const restoreOriginalText = () => {
    if (selectionFrom !== null && selectionTo !== null) {
      editor?.commands.command(({ tr }) => {
        tr.insertText(lastSelectedText, selectionFrom, selectionTo);
        return true;
      });
    }
  };

  useEffect(() => {
    editor.on("selectionUpdate", updateSelectedText);
    return () => {
      editor.off("selectionUpdate", updateSelectedText);
    };
  }, [editor]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleSubmit(e, {
      body: {
        selectedText: lastSelectedText,
      },
    });
  };

  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const lastAssistantMessage = assistantMessages.length
    ? assistantMessages[assistantMessages.length - 1].content
    : "";

  const insertGeneratedContentAtCursor = () => {
    if (lastAssistantMessage && editor) {
      editor.commands.insertContent(lastAssistantMessage);
    }
  };

  return (
    <div className="flex flex-col h-1/2">
      <div className="flex-grow flex justify-end flex-col min-h-0">
        {lastAssistantMessage ? (
          <div
            className={cn(
              "w-full flex max-h-fit flex-col overflow-y-auto no-scrollbar text-sm shadow-inner border border-bermuda-gray-200 rounded-sm p-2 bg-bermuda-gray-50",
              !messages.length && "opacity-50"
            )}
          >
            <div>{lastAssistantMessage}</div>
          </div>
        ) : (
          <Sparkles
            size={16}
            className={cn("m-auto opacity-65", isLoading && "animate-pulse")}
          />
        )}
        {lastAssistantMessage && (
          <div className="flex space-x-2 mt-2">
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-sm py-1.5 px-2 text-xs bg-bermuda-gray-50"
              onClick={insertGeneratedContentAtCursor}
            >
              Insert
            </Button>
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-sm py-1.5 px-2 text-xs bg-bermuda-gray-50"
              onClick={async () => await copyToClipboard(lastAssistantMessage)}
            >
              Copy
            </Button>
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-sm py-1.5 px-2 text-xs bg-bermuda-gray-50"
              onClick={() => reload()}
            >
              Reload
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full flex items-center space-x-1.5 mt-3"
      >
        <input
          name="aiPrompt"
          id="aiPrompt"
          value={input}
          onChange={handleInputChange}
          className="w-full text-sm h-9 p-2 bg-bermuda-gray-50 outline-none rounded-sm"
          placeholder="AI prompt"
          spellCheck="false"
          autoComplete="off"
        />
        <Button
          variant={"menu"}
          type="submit"
          size={"sm"}
          className="py-2 px-3 h-9 rounded-sm bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900"
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
