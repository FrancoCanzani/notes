import Sidebar from '../../../../components/sidebar';
import { getCloudNotes } from '../../../../lib/actions';
import { getServerSession } from 'next-auth';
import Editor from '../../../../components/tiptap-editor';
import { authOptions } from '../../../../lib/auth';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const noteId = params.slug[0];

  if (session && session.user) {
    const userId = session.user.id;
    const notes = await getCloudNotes(userId);

    return (
      <main className='flex'>
        <Sidebar cloudNotes={notes} />
        <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
          <Editor noteId={noteId} />
        </div>
      </main>
    );
  }

  return (
    <main className='flex'>
      <Sidebar />
      <Editor noteId={noteId} />
    </main>
  );
}
