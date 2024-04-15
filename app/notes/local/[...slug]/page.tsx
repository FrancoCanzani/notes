import Sidebar from '../../../components/sidebar';
import Editor from '../../../components/tiptap-editor';

export default async function Page({ params }: { params: { slug: string } }) {
  const noteId = params.slug[0];

  return (
    <main className='flex'>
      <Sidebar />
      <Editor noteId={noteId} />
    </main>
  );
}
