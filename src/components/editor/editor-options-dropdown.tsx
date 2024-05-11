import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Note } from '../../lib/types';
import PublishButton from '../buttons/publish-button';
import { MoreHorizontal } from 'lucide-react';
import { NavigatorShareButton } from '../buttons/navigator-share-button';

export default function EditorOptionsDropdown({ note }: { note: Note }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-0 w-8 p-0 outline-none hover:bg-gray-100 font-bold rounded-md'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-white'>
        <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full text-xs'>
          <PublishButton
            cloudNote={note}
            className='flex items-center justify-start gap-x-2'
          />
        </DropdownMenuItem>
        {note.published && (
          <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full text-xs'>
            <NavigatorShareButton
              className='flex items-center justify-start gap-x-2'
              publicationUrl={`notes-franco.vercel.app/notes/published/${note.id}`}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
