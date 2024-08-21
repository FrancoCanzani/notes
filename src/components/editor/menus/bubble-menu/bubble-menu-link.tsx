import { useState, useEffect, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../ui/popover";
import { Button } from "../../../ui/button";
import { Editor } from "@tiptap/core";
import { Link2Icon } from "@radix-ui/react-icons";

export default function BubbleMenuLink({ editor }: { editor: Editor }) {
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
          className={
            editor.isActive("link")
              ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
              : ""
          }
        >
          <Link2Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit items-center gap-x-0.5 rounded-sm text-xs bg-bermuda-gray-50 p-0.5">
        <form
          className="flex items-start flex-col justify-start p-0.5"
          onSubmit={handleSetLink}
        >
          <div className="flex items-center justify-center gap-x-1 p-0.5">
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
              className="py-2 px-3 h-6 rounded-sm bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900"
            >
              {editor.isActive("link") ? "Update Link" : "Set Link"}
            </Button>
            {editor.isActive("link") && (
              <Button
                variant="destructive"
                onClick={handleUnsetLink}
                className="py-2 px-3 h-6 rounded-sm bg-bermuda-gray-950 text-white hover:bg-bermuda-gray-900"
              >
                Remove Link
              </Button>
            )}
          </div>
          <div className="mt-1">
            <label className="flex items-center justify-start gap-x-2 p-0.5 text-xs font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
              Open in new tab
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="toggle-checkbox"
              />
            </label>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
