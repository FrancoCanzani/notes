import Sidebar from '../components/sidebar';
import { getCloudNotes } from '../lib/actions';
import { auth } from '../lib/auth';
import ActiveNotes from '../components/active-notes';

export default async function Page() {
  const session = await auth();

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);

    return (
      <main className='flex'>
        <Sidebar cloudNotes={notes} />
        <ActiveNotes cloudNotes={notes} />
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
