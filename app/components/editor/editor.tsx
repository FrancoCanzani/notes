'use client';
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from 'next-auth/react';
import { saveCloudNote } from '../../lib/actions';
import { Note } from '../../lib/types';
import handleIndexedDBSave from '../../lib/helpers/handle-index-db-save.';
import { get, del } from 'idb-keyval';
import PublishButton from '../buttons/publish-button';
import { SharePublication } from './share-publication';
import { toast } from 'sonner';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/react';
import '@blocknote/react/style.css';
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core';

export default function Editor({
  noteId,
  cloudNote,
}: {
  noteId: string;
  cloudNote?: Note;
}) {
  const [title, setTitle] = useState(`New note - ${noteId}`);
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | 'loading'
  >('loading');
  const [isSaved, setIsSaved] = useState(false);
  const session = useSession();

  useEffect(() => {
    const loadNote = async () => {
      try {
        if (cloudNote) {
          const { title: storedTitle, content: noteContent } = cloudNote;
          setTitle(storedTitle);
          const content = JSON.parse(noteContent) as PartialBlock[];
          setInitialContent(content);
        } else {
          const note = await get(noteId);
          if (note) {
            const { title: storedTitle, content } = note;
            setTitle(storedTitle);
            setInitialContent(content);
            if (session && session.data) {
              // Convert the local note to cloud when there's a user
              const syncedCloudNote = await saveCloudNote(
                session.data.user.id,
                noteId,
                storedTitle,
                content
              );
              if (syncedCloudNote) {
                await del(noteId);
              }
            }
          } else {
            // If there's no cloudNote and no local note, set initialContent to undefined
            setInitialContent(undefined);
          }
        }
      } catch (error) {
        toast.error('Error loading and syncing note.');
      }
    };

    loadNote();
  }, [noteId]);

  // Debounce the editor updates every second
  const debouncedUpdates = useDebouncedCallback(async (jsonBlocks: Block[]) => {
    setIsSaved(true);
    const content = JSON.stringify(jsonBlocks);

    if (session && session.data) {
      await saveCloudNote(session.data?.user?.id, noteId, title, content);
    } else {
      await handleIndexedDBSave(noteId, title, content);
    }
  }, 1000);

  const editor = useMemo(() => {
    if (initialContent === 'loading') {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined) {
    return 'Loading content...';
  }

  const handleTitleChange = (input: string) => {
    setTitle(input);
    if (!editor) return;
    debouncedUpdates(editor.document);
  };

  if (editor === undefined) {
    return 'Loading content...';
  }

  return (
    <div className='max-w-screen-xl flex-grow overflow-clip m-auto sm:pl-60'>
      <div className='flex flex-col min-h-screen pt-6 pb-3 px-3 container'>
        <div className='w-full overflow-x-clip flex items-center justify-center gap-x-2'>
          <input
            type='text'
            placeholder='Enter a Title'
            onChange={(e) => handleTitleChange(e.target.value)}
            value={title}
            autoFocus
            className='bg-gray-50 w-full rounded-sm outline-none px-3 py-2'
          />
          <PublishButton cloudNote={cloudNote} />
          {cloudNote?.published && (
            <SharePublication
              shareValue={`notes-franco.vercel.app/notes/published/${cloudNote.id}`}
            />
          )}
        </div>
        <BlockNoteView
          editor={editor}
          onChange={() => {
            debouncedUpdates(editor.document);
            setIsSaved(false);
          }}
          className='flex-grow bg-white rounded-sm w-full outline-none p-3'
        />
      </div>
    </div>
  );
}
