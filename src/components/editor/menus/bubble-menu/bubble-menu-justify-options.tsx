import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { Editor } from "@tiptap/core";
import { Button } from "../../../ui/button";
import { cn } from "../../../../lib/utils";

const alignmentOptions = [
  { value: "left", icon: <TextAlignLeftIcon /> },
  { value: "center", icon: <TextAlignCenterIcon /> },
  { value: "right", icon: <TextAlignRightIcon /> },
  { value: "justify", icon: <TextAlignJustifyIcon /> },
  { value: "unset", icon: <ResetIcon /> },
];

export default function BubbleMenuJustifyOptions({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) {
  const [currentAlignment, setCurrentAlignment] = useState("left");

  const handleSelectAlignment = (alignment: string) => {
    if (alignment === "unset") {
      editor.chain().focus().unsetTextAlign().run();
      setCurrentAlignment("left");
    } else {
      editor.chain().focus().setTextAlign(alignment).run();
      setCurrentAlignment(alignment);
    }
  };

  const getIcon = () => {
    const option = alignmentOptions.find(
      (opt) => opt.value === currentAlignment && opt.value !== "unset"
    );
    return option ? option.icon : <TextAlignLeftIcon />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"menu"}
          size={"sm"}
          title="Position"
          className={cn("", className)}
        >
          {getIcon()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit items-center gap-x-0.5 rounded-sm text-xs bg-bermuda-gray-50 p-0.5">
        {alignmentOptions.map(({ value, icon }) => (
          <Button
            variant={"menu"}
            size={"sm"}
            key={value}
            onClick={() => handleSelectAlignment(value)}
            className={
              editor.isActive({ textAlign: value })
                ? "font-bold bg-bermuda-gray-100 hover:bg-bermuda-gray-100"
                : ""
            }
          >
            {icon}
            <span className="sr-only">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
