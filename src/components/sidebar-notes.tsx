import React, { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
} from '@minoru/react-dnd-treeview';
import { Folder, Note } from '../lib/types';
import { updateNoteFolder, createFolder } from '../lib/actions';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import { Folder as FolderClosed, FolderOpen, FileText } from 'lucide-react';

const mapToNodeModel = (folders: Folder[], notes: Note[]): NodeModel[] => {
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

  const folderNodes: NodeModel[] = folders.map((folder) => {
    return {
      id: folder.id || '',
      parent: 0,
      droppable: true,
      text: folder.name,
    };
  });

  const nodeModels: NodeModel[] = [];
  folderNodes.forEach((folderNode) => {
    nodeModels.push(folderNode);
    const notesUnderFolder = folderNotesMap[folderNode.id] || [];
    nodeModels.push(...notesUnderFolder);
  });

  nodeModels.push(...notesWithoutFolder);

  // Log the final node models for debugging
  console.log('Mapped Node Models:', nodeModels);

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
  const [folderName, setFolderName] = useState('');
  const { userId } = useAuth();
  const [previousTreeData, setPreviousTreeData] =
    useState<NodeModel[]>(initialTreeData);

  const handleDrop = async (newTree: NodeModel[]) => {
    try {
      setTreeData(newTree);

      // Identify moved nodes
      const movedNodes = newTree.filter((newNode, index) => {
        const previousNode = previousTreeData[index];
        return newNode.parent !== previousNode.parent;
      });

      console.log('Moved Nodes:', movedNodes);

      for (const node of movedNodes) {
        if (node.id && userId) {
          const isNote = !node.droppable;
          if (isNote) {
            const folderId = node.parent !== 0 ? (node.parent as string) : null;
            console.log(`Updating note ${node.text} to folder ${folderId}`);
            await updateNoteFolder(userId, node.id as string, folderId);
            console.log(`Note ${node.text} successfully updated.`);
          }
        }
      }

      // Update the previous tree data reference
      setPreviousTreeData(newTree);
    } catch (error) {
      toast.error('Error updating folder');
      console.error('Error in handleDrop:', error);
    }
  };

  return (
    <div className='w-full'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (userId && folderName.trim()) {
            try {
              await createFolder(folderName.trim(), userId);
              setFolderName(''); // Clear input field after successful creation
              toast.success('Folder created successfully');
            } catch (error) {
              toast.error('Error creating folder');
            }
          } else {
            toast.error('Folder name cannot be empty');
          }
        }}
      >
        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          type='text'
          className='bg-bermuda-gray-50'
          placeholder='Folder name'
          required
        />
        <button type='submit'>Create Folder</button>
      </form>
      <ScrollArea className='h-[400px] thin-scrollbar w-full text-sm rounded-sm border p-1'>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <div
                key={node.id}
                onClick={node.droppable ? onToggle : undefined}
                style={{ marginInlineStart: depth * 10 }}
                className='flex my-1 hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer'
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
                  <Link
                    className='truncate w-[200px]'
                    href={`/notes/${node.id}`}
                  >
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
    </div>
  );
}
