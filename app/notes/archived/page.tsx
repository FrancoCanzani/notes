import Sidebar from '../../components/sidebar';
import { auth } from '../../lib/auth';
import ArchivedNotes from '../../components/archived-notes';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);

    return (
      <main className='flex'>
        <Sidebar cloudNotes={notes} />
        <ArchivedNotes cloudNotes={notes} />
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
