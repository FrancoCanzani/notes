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

// Utility function to map folders and notes to NodeModel with nesting
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
  const folderNodes: NodeModel[] = folders.map((folder) => ({
    id: folder._id || "",
    parent: 0,
    droppable: true, // Folders can contain notes
    text: folder.name,
  }));

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

    // Update server-side folderId for notes
    for (const node of newTree) {
      if (node.id && userId) {
        // Convert ids to string and check if the node is a note by its parent
        const isNote = !node.droppable && node.parent !== 0;
        if (isNote) {
          try {
            await updateNoteFolder(
              userId,
              node.id as string,
              node.parent !== 0 ? (node.parent as string) : null
            );
          } catch (error) {
            console.error(`Error updating folder for note ${node.id}:`, error);
          }
        }
      }
    }
  };

  return (
    <div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginInlineStart: depth * 10 }}>
              {node.droppable && (
                <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
              )}
              {node.text}
            </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
    </div>
  );
}
