import Sidebar from '../components/sidebar';
import AllNotes from '../components/all-notes';
import { getCloudNotes } from '../lib/actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';


export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);

    return (
      <main className='flex'>
        <Sidebar cloudNotes={notes} />
        <AllNotes cloudNotes={notes} />
      </main>
    );
  }

  return (
    <main className='flex'>
      <Sidebar />
      <AllNotes />
    </main>
  );
}
