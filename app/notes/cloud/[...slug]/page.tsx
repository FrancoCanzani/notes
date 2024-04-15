import Sidebar from '../../../components/sidebar';
import { auth } from '../../../lib/auth';
import Editor from '../../../components/tiptap-editor';
import { getCloudNote } from '../../../lib/helpers/get-cloud-note';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const noteId = params.slug[0];

  if (session && session.user) {
    const userId = session.user.id;
    const note = await getCloudNote(userId, noteId);

    if (note) {
      return (
        <main className='flex'>
          <Sidebar />
          <Editor noteId={noteId} cloudNote={note} />
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
