import { NodeModel } from '@minoru/react-dnd-treeview';
import { Folder, Note } from '../types';

export const mapToNodeModel = (
  folders: Folder[],
  notes: Note[]
): NodeModel[] => {
  const folderNotesMap: { [key: string]: NodeModel[] } = {};
  const notesWithoutFolder: NodeModel[] = [];

  notes.forEach((note) => {
    if (note.folderId) {
      if (!folderNotesMap[note.folderId]) {
        folderNotesMap[note.folderId] = [];
      }
      folderNotesMap[note.folderId].push({
        id: note.id || '',
        parent: note.folderId,
        droppable: false,
        text: note.title,
      });
    } else {
      notesWithoutFolder.push({
        id: note.id || '',
        parent: 0,
        droppable: false,
        text: note.title,
      });
    }
  });

  const folderNodes: NodeModel[] = folders.map((folder) => ({
    id: folder.id || '',
    parent: 0,
    droppable: true,
    text: folder.name,
  }));

  const nodeModels: NodeModel[] = [...folderNodes];

  folderNodes.forEach((folderNode) => {
    const notesUnderFolder = folderNotesMap[folderNode.id] || [];
    nodeModels.push(...notesUnderFolder);
  });

  nodeModels.push(...notesWithoutFolder);

  return nodeModels;
};
