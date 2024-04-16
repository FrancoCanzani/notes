import connectToDatabase from '../db/connect-to-db';
import { Note } from '../db/schemas/note-schema';

export async function getCloudNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    throw new Error('Missing user id for getCloudNote');
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId, id: noteId });
    // We need to parse this because only plain objects can be passed to Client Components from Server Components.
    const parsedNote = JSON.parse(JSON.stringify(note));
    return parsedNote;
  } catch (error) {
    throw error;
  }
}
