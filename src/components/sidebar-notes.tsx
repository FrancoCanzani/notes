import { Note } from '../lib/types';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { DrawingPinFilledIcon, FileIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import SidebarNoteOptions from './sidebar-note-options';

export default function SidebarNotes({ notes }: { notes: Note[] }) {
  const pathname = usePathname();

  const pinnedNotes = notes?.filter((note: Note) => note.pinned === true) || [];
  const activeNotes =
    notes?.filter((note: Note) => note.status === 'active' && !note.pinned) ||
    [];

  return (
    <ScrollArea className='h-max space-y-1.5 transition-all ease-in-out duration-100'>
      {[...pinnedNotes, ...activeNotes].map((note) => (
        <Link href={`/notes/${note.id}`} key={note._id}>
          <div
            className={cn(
              'p-1.5 group my-1 bg-quarter-spanish-white-100 rounded-lg text-sm w-full flex-col items-center justify-between hover:bg-quarter-spanish-white-200',
              pathname.includes(note.id) &&
                'bg-quarter-spanish-white-200 font-semibold'
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
              </div>
            </div>
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
}
