import { auth } from "@clerk/nextjs/server";
import Editor from "../../../components/editor/editor";
import getCloudNotes from "../../../lib/helpers/get-cloud-notes";
import { getCloudNote } from "../../../lib/helpers/get-cloud-note";
import connectToDatabase from "../../../lib/db/connect-to-db";
import Sidebar from "../../../components/sidebar";

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const notes = await getCloudNotes();

    return notes.map((note) => ({
      slug: note.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please log in to view this note</div>;
  }

  const noteId = params.slug;

  try {
    const note = await getCloudNote(userId, noteId);
    const notes = await getCloudNotes(userId);

    if (!note) {
      return <div>Note not found</div>;
    }

    return (
      <div className="w-full sm:flex items-start">
        <aside className="self-start sticky top-0 w-72 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block">
          <Sidebar notes={notes} />
        </aside>
        <main className="flex-1 relative overflow-y-auto">
          <Editor noteId={noteId} note={note} notes={notes} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching note data:", error);
    return <div>Error loading note. Please try again later.</div>;
  }
}
