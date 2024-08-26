import React, { useState, useMemo } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { Folder, Note } from "../lib/types";
import { updateNoteFolder } from "../lib/actions";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { Folder as FolderClosed, FolderOpen, FileText } from "lucide-react";

// Map folders and notes to NodeModel with nesting
const mapToNodeModel = (folders: Folder[], notes: Note[]): NodeModel[] => {
  // Create a map of folder ids to their notes
  const folderNotesMap: { [key: string]: NodeModel[] } = {};
  const notesWithoutFolder: NodeModel[] = [];

  notes.forEach((note) => {
    if (note.folderId) {
      if (!folderNotesMap[note.folderId]) {
        folderNotesMap[note.folderId] = [];
      }
      folderNotesMap[note.folderId].push({
        id: note.id || "",
        parent: note.folderId,
        droppable: false, // Notes cannot contain other items
        text: note.title,
      });
    } else {
      // Notes without a folder
      notesWithoutFolder.push({
        id: note.id || "",
        parent: 0, // Place at root level
        droppable: false, // Notes cannot contain other items
        text: note.title,
      });
    }
  });

  // Create folder nodes
  const folderNodes: NodeModel[] = folders.map((folder) => {
    return {
      id: folder._id || "",
      parent: 0,
      droppable: true,
      text: folder.name,
    };
  });

  // Combine folder nodes with their notes
  const nodeModels: NodeModel[] = [];
  folderNodes.forEach((folderNode) => {
    nodeModels.push(folderNode);
    const notesUnderFolder = folderNotesMap[folderNode.id] || [];
    nodeModels.push(...notesUnderFolder);
  });

  // Add notes that are not in any folder at the bottom
  nodeModels.push(...notesWithoutFolder);

  return nodeModels;
};

export default function SidebarNotes({
  notes,
  folders,
}: {
  notes: Note[];
  folders: Folder[];
}) {
  const initialTreeData = useMemo(
    () => mapToNodeModel(folders, notes),
    [folders, notes]
  );
  const [treeData, setTreeData] = useState<NodeModel[]>(initialTreeData);
  const { userId } = useAuth();

  const handleDrop = async (newTree: NodeModel[]) => {
    setTreeData(newTree);

    for (const node of newTree) {
      if (node.id && userId) {
        const isNote = !node.droppable;
        const isRootLevel = node.parent === 0;

        if (isNote) {
          try {
            // Handle root level (parent as 0) or other folder assignments
            await updateNoteFolder(
              userId,
              node.id as string,
              isRootLevel ? null : (node.parent as string)
            );
          } catch (error) {
            toast.error("Error updating folder");
          }
        }
      }
    }
  };

  return (
    <ScrollArea className="h-[400px] thin-scrollbar w-full text-sm rounded-sm border p-1">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div
              key={node.id}
              onClick={node.droppable ? onToggle : undefined}
              style={{ marginInlineStart: depth * 10 }}
              className="flex my-1 hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer"
            >
              {node.droppable ? (
                <span>
                  {isOpen ? (
                    <FolderOpen size={16} />
                  ) : (
                    <FolderClosed size={16} />
                  )}
                </span>
              ) : (
                <FileText size={16} />
              )}
              {node.droppable ? (
                <span>{node.text}</span>
              ) : (
                <Link className="truncate w-[200px]" href={`/notes/${node.id}`}>
                  {node.text}
                </Link>
              )}
            </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
    </ScrollArea>
  );
}
