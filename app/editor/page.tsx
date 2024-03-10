import Editor from '../components/tiptap-editor';
import Sidebar from '../components/sidebar';

export default function Page() {
  return (
    <main className='flex'>
      <Sidebar />
      <div className='max-w-screen-2xl m-auto overflow-x-hidden sm:pl-60'>
        <Editor />
      </div>
    </main>
  );
}
