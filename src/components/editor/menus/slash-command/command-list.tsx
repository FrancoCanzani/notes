import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { CommandListProps, CommandItemProps } from "@/lib/types";
import { updateScrollView } from "@/lib/helpers/update-scroll-view";

export const CommandList = ({
  items,
  command,
  editor,
  range,
}: CommandListProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        } else if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
        } else if (e.key === "Enter") {
          selectItem(selectedIndex);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, selectItem]);

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
            className={`flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm hover:bg-bermuda-gray-100 ${
              index === selectedIndex
                ? "bg-bermuda-gray-100 text-stone-900"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border bg-bermuda-gray-50">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-gray-800">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};
