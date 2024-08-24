import React from 'react';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from '@minoru/react-dnd-treeview';
import { ScrollArea } from '../ui/scroll-area';
import { Folder, Note } from '../../lib/types';
import { useTreeData } from '../../lib/hooks/use-tree-data';
import { TreeNode } from './sidebar-tree-node';
import NewNoteForm from '../forms/new-note-form';
import NewFolderForm from '../forms/new-folder-form';

export default function SidebarNotes({
  notes,
  folders,
  isNoteFormVisible,
  isFolderFormVisible,
}: {
  notes: Note[];
  folders: Folder[];
  isNoteFormVisible: boolean;
  isFolderFormVisible: boolean;
}) {
  const { treeData, handleDrop } = useTreeData(folders, notes);

  return (
    <div className='w-full h-full flex flex-col'>
      <ScrollArea className='h-[400px] w-full text-sm rounded-sm border p-1'>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          {isNoteFormVisible && <NewNoteForm />}
          {isFolderFormVisible && <NewFolderForm />}
          <Tree
            tree={treeData}
            rootId={0}
            classes={{ root: 'pb-5', draggingSource: 'opacity-50' }}
            render={(node, { depth, isOpen, onToggle }) => (
              <TreeNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
              />
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
