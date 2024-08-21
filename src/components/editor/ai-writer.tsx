import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useChat } from "ai/react";
import { copyToClipboard } from "../../lib/helpers/copy-to-clipboard";
import { MagicWandIcon, UpdateIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

export default function AiWriterView({
  editor,
  node,
  deleteNode,
}: NodeViewProps) {
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
      toast.error("Failed to execute action");
    },
  });

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

  const discard = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper>
      <form
        onSubmit={handleSubmit}
        className="w-full focus:border p-4 bg-bermuda-gray-50 rounded-sm"
      >
        <h4 className="font-medium">Ai Writer</h4>
        <div className="flex-grow flex justify-end flex-col">
          {lastAssistantMessage && (
            <div
              className={cn(
                "w-full flex max-h-fit flex-col overflow-y-auto no-scrollbar text-sm shadow-inner border border-bermuda-gray-200 rounded-sm p-2 bg-bermuda-gray-50",
                !messages.length && "opacity-50"
              )}
            >
              {lastAssistantMessage}
            </div>
          )}
        </div>
        {lastAssistantMessage && (
          <div className="flex items-center justify-start space-x-3 mt-2">
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
            <Button
              variant={"menu"}
              size={"sm"}
              className="rounded-sm py-1.5 px-2 text-xs text-red-600 bg-bermuda-gray-50"
              onClick={discard}
            >
              Discard
            </Button>{" "}
          </div>
        )}
        <div className="w-full flex items-center justify-center space-x-1.5 mt-3">
          <input
            name="aiPrompt"
            id="aiPrompt"
            value={input}
            onChange={handleInputChange}
            className="w-full text-sm h-9 p-2 bg-white outline-none rounded-sm"
            placeholder="Tell me what you want me to write about"
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
        </div>
      </form>
    </NodeViewWrapper>
  );
}
