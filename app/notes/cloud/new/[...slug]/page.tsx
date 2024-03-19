import Editor from '../../../../components/tiptap-editor';
import Sidebar from '../../../../components/sidebar';
import { getServerSession } from 'next-auth';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerSession();
  const user = session?.user;
  const noteId = params.slug[0];

  return (
    <main className='flex'>
      <Sidebar />
      <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
        <Editor noteId={noteId} local={false} />
      </div>
    </main>
  );
}
