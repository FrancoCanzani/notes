import Sidebar from '../../../components/sidebar';
import { auth } from '../../../lib/auth';
import Editor from '../../../components/tiptap-editor';
import { Note } from '../../../lib/types';
import getCloudNotes from '../../../lib/helpers/get-cloud-notes';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const noteId = params.slug[0];

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);

    if (notes) {
      const note: Note = notes.find((note: Note) => note.id === noteId);

      return (
        <main className='flex bg-gray-100'>
          <Sidebar />
          <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
            <Editor noteId={noteId} cloudNote={note} />
          </div>
        </main>
      );
    }
  }

  return (
    <main className='flex bg-gray-100'>
      <Sidebar />
      <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
        <Editor noteId={noteId} />
      </div>
    </main>
  );
}
