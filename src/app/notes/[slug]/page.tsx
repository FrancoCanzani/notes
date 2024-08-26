import { auth } from '@clerk/nextjs/server';
import Editor from '../../../components/editor/editor';
import getCloudNotes from '../../../lib/helpers/get-cloud-notes';
import { getCloudNote } from '../../../lib/helpers/get-cloud-note';
import connectToDatabase from '../../../lib/db/connect-to-db';
import Sidebar from '../../../components/sidebar/sidebar';

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const notes = await getCloudNotes();

    return notes.map((note) => ({
      slug: note.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { userId } = await auth();

  if (!userId) return;

  const noteId = params.slug;

  try {
    const note = await getCloudNote(userId, noteId);
    const notes = await getCloudNotes(userId);

    const serializedNote = JSON.parse(JSON.stringify(note));
    const serializedNotes = JSON.parse(JSON.stringify(notes));

    if (!note) {
      return (
        <div className='w-full sm:flex items-start'>
          <aside className='self-start sticky top-0 w-80 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block'>
            <Sidebar notes={serializedNotes} />
          </aside>
          <main className='flex-1 relative w-full flex items-center h-[calc(100vh)] justify-center capitalize text-bermuda-gray-950 font-medium'>
            <p>Create a new note to start writing.</p>
          </main>
        </div>
      );
    }

    return (
      <div className='w-full sm:flex items-start'>
        <aside className='self-start sticky top-0 w-80 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block'>
          <Sidebar notes={serializedNotes} />
        </aside>
        <main className='flex-1 relative overflow-y-auto'>
          <Editor
            noteId={noteId}
            note={serializedNote}
            notes={serializedNotes}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching note data:', error);
    return <div>Error loading note. Please try again later.</div>;
  }
}
