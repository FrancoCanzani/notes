import { auth } from '../../../lib/auth';
import ActiveNotes from '../../../components/active-notes';
import getCloudNotes from '../../../lib/helpers/get-cloud-notes';
import { Note } from '../../../lib/types';
import { nanoid } from 'nanoid';

export default async function Page() {
  const session = await auth();
  const newNoteId = nanoid(7);

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);
    const parsedNotes: Note[] = JSON.parse(JSON.stringify(notes));

    return (
      <main>
        <ActiveNotes cloudNotes={parsedNotes} />
      </main>
    );
  }

  return (
    <main>
      <ActiveNotes />
    </main>
  );
}
