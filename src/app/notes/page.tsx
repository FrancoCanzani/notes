import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { Note } from '../../lib/types';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  try {
    const { userId } = auth();
    const newNoteId = nanoid(7);

    if (userId) {
      const notes = await getCloudNotes(userId);
      const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));

      if (!parsedNotes) {
        redirect(`/notes/${newNoteId}`);
      }

      const sortedNotes = parsedNotes.sort((a, b) => {
        if (new Date(a.lastSaved) > new Date(b.lastSaved)) {
          return -1;
        }
        if (new Date(a.lastSaved) < new Date(b.lastSaved)) {
          return 1;
        }
        return 0;
      });

      if (sortedNotes.length > 0) {
        redirect(`/notes/${sortedNotes[0].id}`);
      } else {
        redirect(`/notes/${newNoteId}`);
      }
    } else {
      redirect(`/notes/${newNoteId}`);
    }
  } catch (error) {
    redirect(`/notes/${nanoid(7)}`);
  }
}
