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
