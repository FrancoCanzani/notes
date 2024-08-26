import React from "react";
import { CircleDashed } from "lucide-react";
import { CommandItemProps } from "../../../../lib/types";

interface Props {
  item: CommandItemProps;
  isSelected: boolean;
  onSelect: () => void;
  isLoading: boolean;
}

export const CommandItem: React.FC<Props> = ({
  item,
  isSelected,
  onSelect,
  isLoading,
}) => (
  <button
    className={`flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-sm text-stone-900 hover:bg-bermuda-gray-100 ${
      isSelected ? "bg-bermuda-gray-100 text-stone-900" : ""
    }`}
    onClick={onSelect}
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
