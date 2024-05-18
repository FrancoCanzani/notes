import { ReactNode } from 'react';
import Sidebar from '../../components/sidebar';
import getCloudNotes from '../../lib/helpers/get-cloud-notes';
import { auth } from '@clerk/nextjs/server';

export default async function NotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = auth();

  const notes = userId ? await getCloudNotes(userId) : [];
  const parsedNotes = JSON.parse(JSON.stringify(notes));

  return (
    <div className='w-full sm:flex items-start'>
      <aside className='self-start sticky top-0 w-72 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block'>
        <Sidebar notes={parsedNotes} />
      </aside>
      <main className='flex-1 relative overflow-y-auto'>{children}</main>
    </div>
  );
}
