import Sidebar from '../../components/sidebar';
import { auth } from '../../lib/auth';
import ActiveNotes from '../../components/active-notes';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);
    const parsedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <main className='flex'>
        <Sidebar />
        <ActiveNotes cloudNotes={parsedNotes} />
      </main>
    );
  }

  return (
    <main className='flex'>
      <Sidebar />
      <ActiveNotes />
    </main>
  );
}
