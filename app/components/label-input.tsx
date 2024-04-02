import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tag } from 'lucide-react';
import Swatch from '@uiw/react-color-swatch';
import { hsvaToHex } from '@uiw/color-convert';
import { Note } from '../lib/types';
import { set } from 'idb-keyval';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateNoteLabel } from '../lib/actions';

export default function LabelInput({
  note,
  localNotes,
  setLocalNotes,
  userId,
}: {
  note: Note;
  localNotes: Note[];
  setLocalNotes: Dispatch<SetStateAction<Note[]>>;
  userId: string | undefined;
}) {
  const [hex, setHex] = useState(note.label?.color ?? '');
  const [input, setInput] = useState(note.label?.text ?? '');
  const router = useRouter();

  const colors = [
    '#FF7F50',
    '#FF6347',
    '#FF4500',
    '#FFA07A',
    '#FA8072',
    '#E9967A',
    '#F08080',
    '#CD5C5C',
    '#DC143C',
    '#FF0000',
    '#B22222',
    '#8B0000',
    '#FFC0CB',
    '#FF69B4',
    '#FF1493',
    '#DB7093',
    '#C71585',
    '#BA55D3',
    '#9370DB',
    '#8A2BE2',
    '#7B68EE',
    '#6A5ACD',
    '#483D8B',
    '#4169E1',
    '#6495ED',
    '#1E90FF',
    '#00BFFF',
    '#87CEEB',
    '#87CEFA',
    '#ADD8E6',
    '#B0E0E6',
    '#5F9EA0',
    '#4682B4',
    '#B0C4DE',
    '#6495ED',
    '#778899',
    '#708090',
    '#808080',
    '#A9A9A9',
    '#C0C0C0',
    '#D3D3D3',
    '#DCDCDC',
    '#F5F5F5',
    '#F0FFF0',
    '#FAEBD7',
    '#FFEFD5',
    '#FFDAB9',
    '#FFE4B5',
    '#FFFACD',
  ];

  const handleLabelUpdate = async () => {
    try {
      if (note.type === 'local') {
        const updatedNote: Note = {
          ...note,
          label: {
            text: input,
            color: hex,
          },
        };
        await set(note.id, updatedNote);
        const updatedLocalNotes = localNotes.map((n) =>
          n.id === note.id ? updatedNote : n
        );
        setLocalNotes(updatedLocalNotes);
      } else if (userId) {
        await updateNoteLabel(userId, note.id, input, hex);
      }
      router.refresh();
    } catch (error) {
      toast.error(`Failed to change label: ${note.title}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className='text-xs text-gray-600 text-end max-w-[50%]'
          aria-label='Label'
        >
          {/* the note.label?.text.length check allows to reset the label when the input is '' */}
          {note.label?.text.length ? (
            <p
              style={{ backgroundColor: note.label.color }}
              className='text-xs text-gray-600 px-1.5 py-0.5 rounded-sm font-medium truncate'
            >
              {note.label.text}
            </p>
          ) : (
            <Tag size={16} />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md rounded-md bg-white'>
        <DialogHeader>
          <DialogTitle>Label</DialogTitle>
          <DialogDescription>
            Something to categorize your note.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='text' className='sr-only'>
              Label
            </Label>
            <Input
              id='label'
              defaultValue={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <div className=''>
          <Label htmlFor='text' className='font-medium capitalize'>
            Pick a color
          </Label>
          <Swatch
            colors={colors}
            className='mt-3 bg-gray-50 p-2 rounded-md'
            color={hex}
            rectProps={{
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
            onChange={(hsvColor) => {
              setHex(hsvaToHex(hsvColor));
            }}
          />
        </div>
        <DialogFooter className='flex items-center w-full justify-between'>
          <DialogClose asChild>
            <Button
              type='submit'
              variant='outline'
              onClick={() => handleLabelUpdate()}
              className='bg-black py-3 px-4 rounded-md opacity-100 hover:opacity-85 text-white font-medium'
            >
              Save
            </Button>
          </DialogClose>
          <p
            style={{ backgroundColor: hex }}
            className='text-xs flex items-center justify-center max-w-52 h-10 px-4 py-2 rounded-md font-medium text-ellipsis overflow-hidden'
          >
            Your label
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
