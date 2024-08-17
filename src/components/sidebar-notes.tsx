import { Note } from '../lib/types';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { ScrollArea } from './ui/scroll-area';
import {
  DrawingPinFilledIcon,
  FileIcon,
  ClockIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelative } from 'date-fns';
import SidebarNoteOptions from './sidebar-note-options';

export default function SidebarNotes({ notes }: { notes: Note[] }) {
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const pathname = usePathname();

  const pinnedNotes = notes?.filter((note: Note) => note.pinned === true) || [];
  const activeNotes =
    notes?.filter((note: Note) => note.status === 'active' && !note.pinned) ||
    [];

  return (
    <ScrollArea className='h-max space-y-1.5 px-3 transition-all ease-in-out duration-100'>
      {[...pinnedNotes, ...activeNotes].map((note) => (
        <Link href={`/notes/${note.id}`} key={note._id}>
          <div
            className={cn(
              'px-1.5 py-2 group bg-quarter-spanish-white-100 rounded-lg text-sm w-full flex-col items-center justify-between hover:bg-quarter-spanish-white-200',
              pathname.includes(note.id) && 'font-semibold'
            )}
          >
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center w-auto justify-start gap-x-2'>
                {note.pinned ? <DrawingPinFilledIcon /> : <FileIcon />}
                <p title={note.title} className='truncate max-w-44 pr-2'>
                  {note.title}
                </p>
              </div>
              <div className='flex items-center justify-end gap-x-1'>
                <SidebarNoteOptions
                  note={note}
                  className='invisible group-hover:visible'
                />
                {pathname.includes(note.id) && (
                  <span className='h-1 w-1 mr-1 rounded-full bg-black group-hover:hidden'></span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
}
