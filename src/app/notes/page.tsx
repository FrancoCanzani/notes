import { auth } from '../../lib/auth';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { Note } from '../../lib/types';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  const newNoteId = nanoid(7);

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);
    const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));

    const sortedNotes = parsedNotes.sort((a, b) => {
      if (new Date(a.lastSaved) > new Date(b.lastSaved)) {
        return -1;
      }
      if (new Date(a.lastSaved) < new Date(b.lastSaved)) {
        return 1;
      }
      return 0;
    });

    if (sortedNotes) {
      redirect(`/notes/${sortedNotes[0].id}`);
    } else {
      redirect(`/notes/${newNoteId}`);
    }
  }
}
