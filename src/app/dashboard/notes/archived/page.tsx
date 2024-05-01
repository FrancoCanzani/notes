import getCloudNotes from '../../../../lib/helpers/get-cloud-notes';
import ArchivedNotes from '../../../../components/archived-notes';
import { auth } from '../../../../lib/auth';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
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
