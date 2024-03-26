import Sidebar from '../../../../components/sidebar';
import { getCloudNotes } from '../../../../lib/actions';
import Editor from '../../../../components/tiptap-editor';
import { auth } from '../../../../lib/auth';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
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
      <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
        <Editor noteId={noteId} />
      </div>
    </main>
  );
}
