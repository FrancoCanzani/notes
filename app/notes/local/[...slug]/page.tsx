import Sidebar from '../../../components/sidebar';
import Editor from '../../../components/tiptap-editor';

export default async function Page({ params }: { params: { slug: string } }) {
  const noteId = params.slug[0];

  return (
    <main className='flex bg-gray-100'>
      <Sidebar />
      <div className='max-w-screen-xl m-auto overflow-x-hidden sm:pl-60'>
        <Editor noteId={noteId} />
      </div>
    </main>
  );
}
