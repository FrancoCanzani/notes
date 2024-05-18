import getCloudNotes from '../../../lib/helpers/get-cloud-notes';
import ArchivedNotes from '../../../components/archived-notes';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = auth();

  if (userId) {
    const notes = await getCloudNotes(userId);
    const parsedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <main>
        <ArchivedNotes cloudNotes={parsedNotes} />
      </main>
    );
  }

  return (
    <main>
      <ArchivedNotes />
    </main>
  );
}
