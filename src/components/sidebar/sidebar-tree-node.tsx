import React from 'react';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { FolderOpen, FolderSimple, FileText } from '@phosphor-icons/react';
import Link from 'next/link';

export function TreeNode({
  node,
  depth,
  isOpen,
  onToggle,
}: {
  node: NodeModel;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      key={node.id}
      onClick={node.droppable ? onToggle : undefined}
      style={{ marginInlineStart: depth * 7 }}
      className='flex mb-1 hover:bg-bermuda-gray-100 bg-bermuda-gray-50 p-1 items-center justify-start gap-x-1.5 truncate cursor-pointer'
    >
      {node.droppable ? (
        <span>
          {isOpen ? <FolderOpen size={16} /> : <FolderSimple size={16} />}
        </span>
      ) : (
        <FileText size={16} />
      )}
      {node.droppable ? (
        <span>{node.text}</span>
      ) : (
        <Link className='truncate w-[200px]' href={`/notes/${node.id}`}>
          {node.text}
        </Link>
      )}
    </div>
  );
}
