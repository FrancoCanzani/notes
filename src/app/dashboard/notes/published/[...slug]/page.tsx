import Sidebar from '../../../../../components/sidebar';
import NoteEditorPreview from '../../../../../components/note-editor-preview';
import { getPublishedNote } from '../../../../../lib/helpers/getPublishedNote';
import { Note } from '../../../../../lib/types';

export default async function Page({ params }: { params: { slug: string } }) {
  const noteId = params.slug[0];

  const note: Note | null = await getPublishedNote(noteId);

  if (note) {
    return (
      <main className='flex'>
        <Sidebar />
        <div className='max-w-screen-xl flex-grow overflow-clip m-auto sm:pl-80 '>
          <div className='py-6 px-3'>
            <NoteEditorPreview
              content={note.content}
              className='flex-grow bg-white rounded-md w-full shadow outline-none p-3'
            />
          </div>
        </div>
      </main>
    );
  }
}
