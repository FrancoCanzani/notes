import { auth } from '../../../lib/auth';
import ActiveNotes from '../../../components/active-notes';
import getCloudNotes from '../../../lib/helpers/get-cloud-notes';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);
    const parsedNotes = JSON.parse(JSON.stringify(notes));

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
