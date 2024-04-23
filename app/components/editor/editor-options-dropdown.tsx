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

export default function EditorOptionsDropdown({
  cloudNote,
}: {
  cloudNote: Note;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-0 w-8 p-0 hover:bg-gray-100 font-bold rounded-md'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-white text-sm'>
        <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full font-light'>
          <PublishButton
            cloudNote={cloudNote}
            className='flex items-center justify-start gap-x-2'
          />
        </DropdownMenuItem>
        {cloudNote.published && (
          <DropdownMenuItem className='hover:bg-gray-100 rounded-md w-full font-light'>
            <NavigatorShareButton
              className='flex items-center justify-start gap-x-2'
              publicationUrl={`notes-franco.vercel.app/notes/published/${cloudNote.id}`}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
