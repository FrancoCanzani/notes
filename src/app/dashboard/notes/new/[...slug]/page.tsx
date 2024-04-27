import Editor from '../../../../../components/editor/editor';
import Sidebar from '../../../../../components/sidebar';

export default async function Page({ params }: { params: { slug: string } }) {
  const noteId = params.slug[0];

  return (
    <main className='flex'>
      <Sidebar />
      <Editor noteId={noteId} />
    </main>
  );
}
