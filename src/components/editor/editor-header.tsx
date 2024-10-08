import React, { useState, useCallback } from 'react';
import { formatRelative } from 'date-fns';
import { Editor } from '@tiptap/core';
import { DebouncedState } from 'use-debounce';
import { Button } from '../ui/button';
import { List } from 'lucide-react';
import EditorOptionsDropdown from './editor-options-dropdown';
import EditorMobileMenu from './menus/editor-mobile-menu';
import isMobile from '../../lib/helpers/is-mobile';
import NavDrawer from '../nav-drawer';
import { Note } from '../../lib/types';

interface EditorHeaderProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  editor: Editor;
  note: Note | undefined;
  notes: Note[] | undefined;
  debouncedUpdates: DebouncedState<(editor: any) => Promise<void>>;
  isSaved: boolean;
}

export default function EditorHeader({
  title,
  setTitle,
  editor,
  note,
  notes,
  debouncedUpdates,
  isSaved,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const usesMobile = isMobile();

  const handleTitleChange = useCallback(
    (input: string) => {
      setTitle(input);
      if (editor && input.trim().length > 0) {
        debouncedUpdates(editor);
      }
    },
    [editor, debouncedUpdates, setTitle]
  );

  const handleTitleClick = () => setIsEditing(true);
  const handleInputBlur = () => setIsEditing(false);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setIsEditing(false);
  };

  return (
    <div className='w-full sticky top-0 py-3 z-40 bg-bermuda-gray/40 backdrop-blur-lg supports-[backdrop-filter]:bg-bermuda-gray/90'>
      <div className='max-w-4xl mx-auto pb-3 px-2.5 text-xs flex items-center justify-between'>
        <div className='flex sm:max-w-[40%] max-w-[60%] items-center justify-start gap-x-2'>
          <NavDrawer notes={notes}>
            <Button variant='menu' size='sm' className='border-none sm:hidden'>
              <List size={18} />
            </Button>
          </NavDrawer>
          {isEditing ? (
            <input
              type='text'
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className='font-medium sm:text-xl text-lg outline-none bg-transparent'
              aria-label='Note title'
            />
          ) : (
            <p
              onClick={handleTitleClick}
              className='font-medium sm:text-xl text-lg outline-none bg-transparent cursor-pointer truncate'
            >
              {title || 'Untitled'}
            </p>
          )}
        </div>
        <div className='flex items-center justify-end gap-x-2 md:gap-x-3'>
          {note && (
            <>
              {isSaved ? (
                <span className='bg-bermuda-gray-950 text-white text-xs rounded-sm px-1.5 py-1 font-semibold'>
                  Saved
                </span>
              ) : (
                <span className='animate-pulse bg-bermuda-gray-950 text-white text-xs rounded-sm px-1.5 py-1 font-semibold'>
                  Saving...
                </span>
              )}
              <span className='text-gray-400 hidden capitalize sm:block text-sm'>
                {formatRelative(new Date(note.lastSaved), new Date())}
              </span>
              <EditorOptionsDropdown note={note} editor={editor} />
            </>
          )}
        </div>
      </div>
      {usesMobile && <EditorMobileMenu editor={editor} />}
    </div>
  );
}
