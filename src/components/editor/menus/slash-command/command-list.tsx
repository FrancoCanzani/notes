import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";
import { useCompletion } from "ai/react";
import { CircleDashed } from "lucide-react";
import { toast } from "sonner";
import { getPrevText } from "../../../../lib/helpers/get-prev-text";
import { updateScrollView } from "../../../../lib/helpers/update-scroll-view";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const CommandList = ({
  items,
  command,
  editor,
  range,
}: {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { complete, isLoading } = useCompletion({
    id: "editor",
    api: "/api/ai",
    onResponse: (response) => {
      editor.chain().focus().deleteRange(range).run();
    },
    onFinish: (_prompt, completion) => {
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length,
      });
    },
    onError: (e) => {
      toast.error("Failed to execute command");
    },
  });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        if (item.title === "Write Magic") {
          if (isLoading) return;
          const text = getPrevText(editor, {
            chars: 5000,
            offset: 1,
          });
          complete(text, {
            body: { option: "continue" },
          });
        } else {
          command(item);
        }
      }
    },
    [complete, isLoading, command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;
    const item = container?.children[selectedIndex] as HTMLElement;
    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 bg-white no-scrollbar h-auto max-h-[330px] w-72 overflow-y-auto rounded-sm border border-stone-200 px-1 py-2 shadow-md transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm text-stone-900 hover:bg-bermuda-gray-100 ${
              index === selectedIndex
                ? "bg-bermuda-gray-100 text-stone-900"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-stone-200 bg-bermuda-gray-50">
              {item.title === "Write Magic" && isLoading ? (
                <CircleDashed className="animate-spin" size={16} />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-stone-500">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};
