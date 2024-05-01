import Editor from '../../../../components/editor/editor';
import { getCloudNote } from '../../../../lib/helpers/get-cloud-note';
import getCloudNotes from '../../../../lib/helpers/get-cloud-notes';
import { auth } from '../../../../lib/auth';

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const noteId = params.slug[0];

  if (session && session.user) {
    const userId = session.user.id;
    const note = await getCloudNote(userId, noteId);
    const parsedNote = JSON.parse(JSON.stringify(note));
    const notes = await getCloudNotes(userId);
    const parsedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <main>
        <Editor noteId={noteId} cloudNote={parsedNote} />
      </main>
    );
  }

  return (
    <main>
      <Editor noteId={noteId} />
    </main>
  );
}
