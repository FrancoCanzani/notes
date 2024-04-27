import getCloudNotes from '../../../../lib/helpers/get-cloud-notes';
import ArchivedNotes from '../../../../components/archived-notes';
import { auth } from '../../../../lib/auth';
import Sidebar from '../../../../components/sidebar';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);
    const parsedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <main className='flex'>
        <Sidebar notes={notes} />
        <ArchivedNotes cloudNotes={parsedNotes} />
      </main>
    );
  }

  return (
    <main className='flex'>
      <Sidebar />
      <ArchivedNotes />
    </main>
  );
}
