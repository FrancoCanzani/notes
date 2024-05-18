import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { Note } from '../../lib/types';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const newNoteId = nanoid(7);

  try {
    const { userId } = auth();

    if (!userId) {
      console.error('User not authenticated');
      redirect(`/`);
    }

    const notes = await getCloudNotes(userId);

    if (!notes) {
      console.error('No notes found for user:', userId);
      redirect(`/notes/${newNoteId}`);
    }

    const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));

    if (parsedNotes.length === 0) {
      console.log('No notes available for user:', userId);
      redirect(`/notes/${newNoteId}`);
    }

    const sortedNotes = parsedNotes.sort((a, b) => {
      return new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime();
    });

    console.log('Redirecting to the last edited note:', sortedNotes[0].id);
    redirect(`/notes/${sortedNotes[0].id}`);
  } catch (error) {
    console.error('An error occurred:', error);
    redirect(`/notes/${newNoteId}`);
  }
}
