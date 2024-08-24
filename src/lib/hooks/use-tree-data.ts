import { useState, useMemo } from 'react';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { updateNoteFolder } from '../actions';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Folder, Note } from '../types';
import { mapToNodeModel } from '../helpers/map-to-model';

export const useTreeData = (folders: Folder[], notes: Note[]) => {
  const initialTreeData = useMemo(
    () => mapToNodeModel(folders, notes),
    [folders, notes]
  );
  const [treeData, setTreeData] = useState<NodeModel[]>(initialTreeData);
  const [previousTreeData, setPreviousTreeData] =
    useState<NodeModel[]>(initialTreeData);
  const { userId } = useAuth();

  const handleDrop = async (newTree: NodeModel[]) => {
    try {
      setTreeData(newTree);

      const movedNodes = newTree.filter((newNode, index) => {
        const previousNode = previousTreeData[index];
        return newNode.parent !== previousNode.parent;
      });

      for (const node of movedNodes) {
        if (node.id && userId) {
          const isNote = !node.droppable;
          if (isNote) {
            const folderId = node.parent !== 0 ? (node.parent as string) : null;
            await updateNoteFolder(userId, node.id as string, folderId);
          }
        }
      }

      setPreviousTreeData(newTree);
    } catch (error) {
      toast.error('Error updating folder');
      console.error('Error in handleDrop:', error);
    }
  };

  return {
    treeData,
    handleDrop,
  };
};
