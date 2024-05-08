import { ReactNode } from 'react';
import Sidebar from '../../components/sidebar';
import { auth } from '../../lib/auth';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';

export default async function NotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  const notes = session ? await getCloudNotes(session.user.id) : [];

  return (
    <div className='w-full sm:flex items-start'>
      <aside className='self-start sticky top-0 w-72 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block'>
        <Sidebar notes={notes} />
      </aside>
      <main className='flex-1 relative overflow-y-auto'>{children}</main>
    </div>
  );
}
