import connectToDatabase from '../db/connect-to-db';
import { Note } from '../db/schemas/note-schema';
import { getUnifiedId } from './get-unified-id';

export async function getCloudNote(userId: string | undefined, noteId: string) {
  if (!userId) {
    return null;
  }

  try {
    await connectToDatabase();

    const note = await Note.findOne({ userId: userId, id: noteId });
    return note;
  } catch (error) {
    throw error;
  }
}
