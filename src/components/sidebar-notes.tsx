import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import {
  DrawingPinFilledIcon,
  FileIcon,
  ArchiveIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import SidebarNoteOptions from "./sidebar-note-options";
import { useState } from "react";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { Note, Folder } from "../lib/types";
import { createFolder } from "../lib/actions";
import { useAuth } from "@clerk/nextjs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SidebarNotesProps {
  notes: Note[];
  folders: Folder[];
}

interface TreeNodeData {
  isFolder: boolean;
  note?: Note;
}

export default function SidebarNotes({ notes, folders }: SidebarNotesProps) {
  const { userId } = useAuth();
  const pathname = usePathname();
  const [treeData, setTreeData] = useState<NodeModel<TreeNodeData>[]>([
    ...folders.map((folder) => ({
      id: folder._id!,
      parent: folder.parentFolderId || 0,
      droppable: true,
      text: folder.name,
      data: { isFolder: true },
    })),
    ...notes.map((note) => ({
      id: note._id!,
      parent: note.folderId || 0,
      droppable: false,
      text: note.title,
      data: { isFolder: false, note },
    })),
  ]);

  const [folderName, setFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const handleDrop = (newTree: NodeModel<TreeNodeData>[]) => {
    setTreeData(newTree);
    // You would also send the new tree structure to the server to persist changes
  };

  const handleFolderCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim() && userId) {
      await createFolder(folderName, userId);
      setFolderName("");
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderNode = (node: NodeModel<TreeNodeData>) => {
    const { isFolder, note } = node.data;
    const isExpanded = expandedFolders.includes(node.id as string);

    return (
      <div
        className={cn(
          "p-1.5 group my-1 bg-bermuda-gray-50 rounded-sm text-sm w-full flex-col items-center justify-between hover:bg-bermuda-gray-200",
          pathname.includes(node.id as string) &&
            "bg-bermuda-gray-200 font-semibold"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-auto justify-start gap-x-2">
            {isFolder && (
              <button onClick={() => toggleFolder(node.id as string)}>
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </button>
            )}
            {isFolder ? (
              <ArchiveIcon />
            ) : note?.pinned ? (
              <DrawingPinFilledIcon />
            ) : (
              <FileIcon />
            )}
            <p title={node.text} className="truncate max-w-44 pr-2">
              {node.text}
            </p>
          </div>
          <div className="flex items-center justify-end gap-x-1">
            {!isFolder && note && (
              <SidebarNoteOptions
                note={note}
                className="invisible group-hover:visible"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ScrollArea className="h-[300px] space-y-2">
        <form onSubmit={handleFolderCreate} className="mb-4">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="New Folder"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Folder
          </button>
        </form>

        <Tree
          tree={treeData}
          rootId={0}
          render={renderNode}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
          classes={{
            root: "space-y-2",
            draggingSource: "opacity-50",
            dropTarget: "bg-blue-100",
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          dropTargetOffset={10}
          placeholderRender={(node, { depth }) => (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: "0",
                height: "100%",
                width: "2px",
                transform: `translateX(${depth * 24}px)`,
              }}
              className="bg-blue-400"
            />
          )}
        />
      </ScrollArea>
    </DndProvider>
  );
}
