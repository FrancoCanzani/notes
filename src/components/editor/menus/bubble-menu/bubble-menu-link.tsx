import { useState, useEffect, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../ui/popover";
import { Button } from "../../../ui/button";
import { Editor } from "@tiptap/core";
import { Link2Icon } from "@radix-ui/react-icons";
import { cn } from "../../../../lib/utils";

export default function BubbleMenuLink({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) {
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(
    editor.getAttributes("link").target === "_blank"
  );

  useEffect(() => {
    const updateLinkState = () => {
      setUrl(editor.getAttributes("link").href || "");
      setOpenInNewTab(editor.getAttributes("link").target === "_blank");
    };

    editor.on("selectionUpdate", updateLinkState);
    editor.on("transaction", updateLinkState);

    return () => {
      editor.off("selectionUpdate", updateLinkState);
      editor.off("transaction", updateLinkState);
    };
  }, [editor]);

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleSetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl(url)) {
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: openInNewTab ? "_blank" : null })
        .run();
    }
  };

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run();
    setUrl("");
  };

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(event.target.value);
    },
    []
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"menu"}
          size={"sm"}
          title="Link"
          className={cn("", className)}
        >
          <Link2Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit items-center gap-x-0.5 rounded-sm text-xs bg-bermuda-gray-50 p-0.5">
        <form
          className="flex items-center justify-center gap-x-1 p-0.5"
          onSubmit={handleSetLink}
        >
          <input
            type="url"
            placeholder="Enter URL"
            value={url}
            autoComplete="off"
            onChange={handleUrlChange}
            className="w-full text-sm h-6 p-2 bg-white outline-none rounded-sm"
          />
          <Button
            type="submit"
            className="p-2 h-6 rounded-sm bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900"
          >
            {editor.isActive("link") ? "Update" : "Set"}
          </Button>
          {editor.isActive("link") && (
            <Button
              variant="destructive"
              onClick={handleUnsetLink}
              className="p-2 h-6 rounded-sm bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900"
            >
              Remove
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
}
