import Sidebar from '../../components/sidebar';
import { auth } from '../../lib/auth';
import Editor from '../../components/editor/editor';
import { getCloudNote } from '../../lib/helpers/get-cloud-note';
import { Note } from '../../lib/types';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const noteId = params.slug[0];

  if (session && session.user) {
    const userId = session.user.id;
    const note: Note = await getCloudNote(userId, noteId);
    const parsedNote = JSON.parse(JSON.stringify(note));

    if (note) {
      return (
        <main className='flex'>
          <Sidebar />
          <Editor noteId={noteId} cloudNote={parsedNote} />
        </main>
      );
    }
  }

  return (
    <main className='flex'>
      <Sidebar />
      <Editor noteId={noteId} />
    </main>
  );
}
