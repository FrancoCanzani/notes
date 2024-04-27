'use client';

import { Note } from '../../../lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: 'title',
    header: () => <div className=''>Title</div>,
    cell: ({ row }) => {
      return (
        <div
          className='text-right font-medium truncate w-36'
          title={row.getValue('title')}
        >
          {row.getValue('title')}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: () => <div className=''>Storage</div>,
    cell: ({ row }) => {
      return (
        <div className='capitalize' title={row.getValue('type')}>
          {row.getValue('type')}
        </div>
      );
    },
  },
  {
    accessorKey: 'published',
    header: 'Published',
  },
  {
    accessorKey: 'lastSaved',
    header: () => <div className=''>Last Edit</div>,
    cell: ({ row }) => {
      return (
        <div className=''>
          {formatDistanceToNowStrict(row.getValue('lastSaved'))}
        </div>
      );
    },
  },
];
